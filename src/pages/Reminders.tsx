import { useState } from 'react';
import { FeedingSession, PumpingSession, Reminder } from '../types';
import { Button } from '../components/ui/Button';
import { uid } from '../services/storageService';
import { Bell, Clock, Power, Trash2 } from 'lucide-react';
import { reminderBaseline } from '../services/localNotificationService';

const reminderIntervalText = (minutes?: number) => {
  if (!minutes) return 'ללא מרווח קבוע';
  if (minutes % 60 === 0) return `כל ${minutes} דקות (${minutes / 60} שעות)`;
  return `כל ${minutes} דקות`;
};

export function Reminders({
  babyId,
  reminders,
  feedings,
  pumping,
  onSave,
  onDelete,
  onToggle,
}: {
  babyId: string;
  reminders: Reminder[];
  feedings: FeedingSession[];
  pumping: PumpingSession[];
  onSave: (item: Reminder) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
  onToggle: (item: Reminder) => void | Promise<void>;
}) {
  const [type, setType] = useState<Reminder['type']>('feeding');
  const [intervalMinutes, setInterval] = useState(180);

  const add = () =>
    onSave({
      id: uid(),
      babyId,
      type,
      title: type === 'feeding' ? 'תזכורת הנקה' : 'תזכורת שאיבה',
      intervalMinutes,
      isActive: true,
      createdAt: new Date().toISOString(),
    });

  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-bold text-primary-hover">התראות במכשיר</p>
        <h1 className="text-3xl font-extrabold">תזכורות</h1>
      </div>

      <div className="theme-card space-y-4 rounded-3xl p-5">
        <label className="block">
          <span className="theme-muted mb-1 block text-sm font-bold">סוג תזכורת</span>
          <select className="field" value={type} onChange={(event) => setType(event.target.value as Reminder['type'])}>
            <option value="feeding">הנקה</option>
            <option value="pumping">שאיבה</option>
          </select>
        </label>

        <label className="block">
          <span className="theme-muted mb-1 block text-sm font-bold">מרווח תזכורת בדקות</span>
          <div className="relative">
            <input
              className="field pl-16"
              type="number"
              min="1"
              step="1"
              value={intervalMinutes}
              placeholder="לדוגמה: 180"
              onChange={(event) => setInterval(Number(event.target.value))}
            />
            <span className="theme-muted pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold">דקות</span>
          </div>
          <p className="theme-helper mt-2 rounded-2xl px-3 py-2 text-sm font-semibold">לדוגמה: 180 דקות = 3 שעות</p>
        </label>

        <Button className="w-full" onClick={add} icon={<Clock size={18} />}>הוספת תזכורת</Button>
      </div>

      <div className="space-y-3">
        {reminders.map((item) => {
          const isWaiting = item.isActive && !reminderBaseline(item, feedings, pumping);
          return (
          <article key={item.id} className={`theme-card flex items-center justify-between rounded-3xl p-4 ${item.isActive ? '' : 'opacity-65'}`}>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-surface text-primary-text">
                <Bell size={20} />
              </div>
              <div>
                <p className="font-extrabold">{item.title}</p>
                <p className="theme-muted text-sm">{reminderIntervalText(item.intervalMinutes)}</p>
                {isWaiting && <p className="mt-1 text-sm font-bold text-primary-text">{item.type === 'feeding' ? 'התזכורת תתחיל אחרי ההנקה הראשונה' : 'התזכורת תתחיל אחרי השאיבה הראשונה'}</p>}
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" className="theme-muted h-10 min-h-10 px-3" onClick={() => onToggle(item)} aria-label={item.isActive ? 'כיבוי תזכורת' : 'הפעלת תזכורת'}><Power size={18} /></Button>
              <Button variant="ghost" className="theme-muted h-10 min-h-10 px-3" onClick={() => onDelete(item.id)} aria-label="מחיקה"><Trash2 size={18} /></Button>
            </div>
          </article>
          );
        })}
      </div>
    </section>
  );
}
