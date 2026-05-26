import { useState } from 'react';
import { Reminder } from '../types';
import { Button } from '../components/ui/Button';
import { uid } from '../services/storageService';
import { Bell, Clock, Trash2 } from 'lucide-react';

const reminderIntervalText = (minutes?: number) => {
  if (!minutes) return 'ללא מרווח קבוע';
  if (minutes % 60 === 0) return `כל ${minutes} דקות (${minutes / 60} שעות)`;
  return `כל ${minutes} דקות`;
};

export function Reminders({
  babyId,
  reminders,
  onSave,
  onDelete,
}: {
  babyId: string;
  reminders: Reminder[];
  onSave: (item: Reminder) => void;
  onDelete: (id: string) => void;
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
        <p className="text-sm font-bold text-primary-hover">ללא התראות חיצוניות</p>
        <h1 className="text-3xl font-extrabold">תזכורות</h1>
      </div>

      <div className="space-y-4 rounded-3xl border border-line bg-card p-5 shadow-soft">
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-text-muted">סוג תזכורת</span>
          <select className="field" value={type} onChange={(e) => setType(e.target.value as Reminder['type'])}>
            <option value="feeding">הנקה</option>
            <option value="pumping">שאיבה</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-bold text-text-muted">מרווח תזכורת בדקות</span>
          <div className="relative">
            <input
              className="field pl-16"
              type="number"
              min="15"
              step="15"
              value={intervalMinutes}
              placeholder="לדוגמה: 180"
              onChange={(e) => setInterval(Number(e.target.value))}
            />
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-text-muted">
              דקות
            </span>
          </div>
          <p className="mt-2 rounded-2xl bg-blue-surface px-3 py-2 text-sm font-semibold text-text-muted">
            לדוגמה: 180 דקות = 3 שעות
          </p>
        </label>

        <Button className="w-full" onClick={add} icon={<Clock size={18} />}>
          הוספת תזכורת
        </Button>
      </div>

      <div className="space-y-3">
        {reminders.map((item) => (
          <article key={item.id} className="flex items-center justify-between rounded-3xl border border-line bg-card p-4 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-surface text-primary-text">
                <Bell size={20} />
              </div>
              <div>
                <p className="font-extrabold">{item.title}</p>
                <p className="text-sm text-text-muted">{reminderIntervalText(item.intervalMinutes)}</p>
              </div>
            </div>
            <Button variant="ghost" className="text-text-muted" onClick={() => onDelete(item.id)} aria-label="מחיקה">
              <Trash2 size={18} />
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}
