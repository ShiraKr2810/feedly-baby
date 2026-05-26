import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ReactNode } from 'react';
import { AppSettings, BottleSession, FeedingSession, PumpingSession } from '../types';
import { Card } from '../components/ui/Card';
import { formatDuration, isNightSession, isSameDay, timeAgo, todayKey } from '../services/dateUtils';
import { latestCompletedFeeding, totalSideDurations } from '../services/feedingUtils';

const lastDays = () => Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (6 - i));
  return todayKey(date);
});

export function Statistics({ feedings, pumping, bottles, settings }: { feedings: FeedingSession[]; pumping: PumpingSession[]; bottles: BottleSession[]; settings: AppSettings }) {
  const today = feedings.filter((item) => isSameDay(item.startTime));
  const totalToday = today.reduce((sum, item) => sum + item.totalDurationSeconds, 0);
  const avg = feedings.length ? feedings.reduce((sum, item) => sum + item.totalDurationSeconds, 0) / feedings.length : 0;
  const latest = latestCompletedFeeding(feedings);
  const sideTotals = totalSideDurations(feedings);
  const nightFeedings = feedings.filter((item) => isNightSession(item.startTime, settings.nightStart, settings.nightEnd)).length;
  const days = lastDays();
  const feedingData = days.map((day) => {
    const dayItems = feedings.filter((item) => todayKey(new Date(item.startTime)) === day);
    return { day: day.slice(5), count: dayItems.length, avg: dayItems.length ? Math.round(dayItems.reduce((s, i) => s + i.totalDurationSeconds, 0) / dayItems.length / 60) : 0 };
  });
  const pumpingData = days.map((day) => ({ day: day.slice(5), amount: pumping.filter((item) => todayKey(new Date(item.time)) === day).reduce((s, i) => s + i.amountMl, 0) }));
  const bottleData = days.map((day) => ({ day: day.slice(5), amount: bottles.filter((item) => todayKey(new Date(item.time)) === day).reduce((s, i) => s + i.amountMl, 0) }));

  return (
    <section className="space-y-4">
      <div><p className="text-sm font-bold text-primary-hover">תמונה יומית</p><h1 className="text-3xl font-extrabold">סטטיסטיקות</h1></div>
      <div className="grid grid-cols-2 gap-3">
        <Card><p className="text-sm text-text-main/55">הנקות היום</p><b className="text-3xl">{today.length}</b></Card>
        <Card><p className="text-sm text-text-main/55">זמן הנקה היום</p><b className="text-2xl">{formatDuration(totalToday)}</b></Card>
        <Card><p className="text-sm text-text-main/55">משך ממוצע</p><b className="text-2xl">{formatDuration(avg)}</b></Card>
        <Card><p className="text-sm text-text-main/55">מאז האכלה</p><b className="text-xl">{timeAgo(latest?.endTime)}</b></Card>
        <Card><p className="text-sm text-text-main/55">צד דומיננטי</p><b className="text-2xl">{sideTotals.right >= sideTotals.left ? 'ימין' : 'שמאל'}</b></Card>
        <Card><p className="text-sm text-text-main/55">הנקות לילה</p><b className="text-3xl">{nightFeedings}</b></Card>
      </div>
      <Chart title="הנקות לפי יום"><ResponsiveContainer width="100%" height={190}><BarChart data={feedingData}><CartesianGrid stroke="#DDEAF5" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="day" stroke="#8A94A6" /><YAxis allowDecimals={false} stroke="#8A94A6" /><Tooltip /><Bar dataKey="count" fill="#A9D8F5" radius={[10, 10, 0, 0]} /></BarChart></ResponsiveContainer></Chart>
      <Chart title="משך ממוצע בדקות"><ResponsiveContainer width="100%" height={190}><LineChart data={feedingData}><CartesianGrid stroke="#DDEAF5" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="day" stroke="#8A94A6" /><YAxis stroke="#8A94A6" /><Tooltip /><Line type="monotone" dataKey="avg" stroke="#F7CFE1" strokeWidth={3} dot={{ r: 4, fill: '#F7CFE1' }} /></LineChart></ResponsiveContainer></Chart>
      <Chart title="ימין מול שמאל"><ResponsiveContainer width="100%" height={190}><PieChart><Pie data={[{ name: 'ימין', value: sideTotals.right }, { name: 'שמאל', value: sideTotals.left }]} dataKey="value" innerRadius={48} outerRadius={76}><Cell fill="#A9D8F5" /><Cell fill="#F7CFE1" /></Pie><Tooltip /></PieChart></ResponsiveContainer></Chart>
      <Chart title="כמות שאיבה לפי יום"><ResponsiveContainer width="100%" height={190}><BarChart data={pumpingData}><XAxis dataKey="day" stroke="#8A94A6" /><YAxis stroke="#8A94A6" /><Tooltip /><Bar dataKey="amount" fill="#BFE3F8" radius={[10, 10, 0, 0]} /></BarChart></ResponsiveContainer></Chart>
      <Chart title="כמות בקבוקים לפי יום"><ResponsiveContainer width="100%" height={190}><BarChart data={bottleData}><XAxis dataKey="day" stroke="#8A94A6" /><YAxis stroke="#8A94A6" /><Tooltip /><Bar dataKey="amount" fill="#F7CFE1" radius={[10, 10, 0, 0]} /></BarChart></ResponsiveContainer></Chart>
    </section>
  );
}

function Chart({ title, children }: { title: string; children: ReactNode }) {
  return <div className="rounded-3xl border border-white/85 bg-white/90 p-4 shadow-soft"><h2 className="mb-3 font-extrabold">{title}</h2>{children}</div>;
}
