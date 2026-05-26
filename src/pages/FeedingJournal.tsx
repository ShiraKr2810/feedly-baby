import { useState } from 'react';
import { FeedingSession, Page } from '../types';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { JournalTabs } from '../components/ui/JournalTabs';
import { formatDateTime, formatDuration, todayKey } from '../services/dateUtils';
import { sideLabel } from '../services/feedingUtils';
import { BookOpen, Pencil, Trash2 } from 'lucide-react';

export function FeedingJournal({
  feedings,
  onUpdate,
  onDelete,
  setPage,
}: {
  feedings: FeedingSession[];
  onUpdate: (feeding: FeedingSession) => void;
  onDelete: (id: string) => void;
  setPage: (page: Page) => void;
}) {
  const [date, setDate] = useState('');
  const [editing, setEditing] = useState<FeedingSession | null>(null);
  const [editForm, setEditForm] = useState({ right: 0, left: 0, note: '' });
  const items = [...feedings]
    .filter((item) => !date || todayKey(new Date(item.startTime)) === date)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-primary-hover">יומן</p>
          <h1 className="text-3xl font-extrabold">הנקות</h1>
        </div>
      </div>
      <JournalTabs active="journal" onChange={setPage} />
      <input className="field" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
      {editing && (
        <div className="space-y-3 rounded-3xl border border-white/85 bg-white/90 p-5 shadow-soft">
          <p className="font-extrabold">עריכת הנקה</p>
          <div className="grid grid-cols-2 gap-2">
            <input className="field" type="number" value={editForm.right} onChange={(event) => setEditForm({ ...editForm, right: Number(event.target.value) })} placeholder="ימין בדקות" />
            <input className="field" type="number" value={editForm.left} onChange={(event) => setEditForm({ ...editForm, left: Number(event.target.value) })} placeholder="שמאל בדקות" />
          </div>
          <input className="field" value={editForm.note} onChange={(event) => setEditForm({ ...editForm, note: event.target.value })} placeholder="הערה" />
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => setEditing(null)}>ביטול</Button>
            <Button onClick={() => {
              onUpdate({
                ...editing,
                rightDurationSeconds: editForm.right * 60,
                leftDurationSeconds: editForm.left * 60,
                totalDurationSeconds: (editForm.right + editForm.left) * 60,
                note: editForm.note || undefined,
              });
              setEditing(null);
            }}>שמירה</Button>
          </div>
        </div>
      )}
      {items.length === 0 ? (
        <EmptyState icon={<BookOpen />} title="עוד אין הנקות ביומן" text="כשתשמרי הנקה היא תופיע כאן עם זמן, צדדים והערות." />
      ) : (
        <div className="space-y-3">
          {items.map((feeding) => (
            <article key={feeding.id} className="rounded-3xl border border-white/85 bg-white/90 p-4 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-extrabold">{formatDateTime(feeding.startTime)}</p>
                  <p className="text-sm text-text-main/60">סה״כ {formatDuration(feeding.totalDurationSeconds)} · התחלה {sideLabel(feeding.startSide)}</p>
                  <p className="text-sm text-text-main/60">ימין {formatDuration(feeding.rightDurationSeconds)} · שמאל {formatDuration(feeding.leftDurationSeconds)}</p>
                  {feeding.note && <p className="mt-2 text-sm">{feeding.note}</p>}
                  {feeding.needsReview && <span className="mt-2 inline-block rounded-full bg-pink-surface px-3 py-1 text-xs font-bold text-primary-text">דורש השלמה</span>}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" className="h-10 min-h-10 px-3" aria-label="עריכה" onClick={() => {
                    setEditing(feeding);
                    setEditForm({ right: Math.round(feeding.rightDurationSeconds / 60), left: Math.round(feeding.leftDurationSeconds / 60), note: feeding.note ?? '' });
                  }}><Pencil size={17} /></Button>
                  <Button variant="ghost" className="h-10 min-h-10 px-3 text-text-muted" aria-label="מחיקה" onClick={() => onDelete(feeding.id)}><Trash2 size={17} /></Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
