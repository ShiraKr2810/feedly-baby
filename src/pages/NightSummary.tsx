import { useState } from 'react';
import { AppSettings, FeedingSession } from '../types';
import { Button } from '../components/ui/Button';
import { formatDateTime, formatDuration, formatTime, isNightSession } from '../services/dateUtils';

export function NightSummary({ feedings, settings, onUpdate, onReviewed }: { feedings: FeedingSession[]; settings: AppSettings; onUpdate: (item: FeedingSession) => void; onReviewed: () => void }) {
  const nightItems = feedings.filter((item) => isNightSession(item.startTime, settings.nightStart, settings.nightEnd)).sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  const [drafts, setDrafts] = useState<Record<string, { end: string; right: number; left: number }>>({});
  const getDraft = (item: FeedingSession) => drafts[item.id] ?? { end: (item.endTime ?? new Date().toISOString()).slice(0, 16), right: Math.round(item.rightDurationSeconds / 60), left: Math.round(item.leftDurationSeconds / 60) };
  const save = (item: FeedingSession) => {
    const draft = getDraft(item);
    onUpdate({ ...item, endTime: new Date(draft.end).toISOString(), rightDurationSeconds: draft.right * 60, leftDurationSeconds: draft.left * 60, totalDurationSeconds: (draft.right + draft.left) * 60, isIncomplete: false, needsReview: false });
  };
  return <section className="space-y-4">
    <div><p className="text-sm font-bold text-primary-hover">בוקר טוב</p><h1 className="text-3xl font-extrabold">סיכום לילה</h1></div>
    <div className="rounded-3xl border border-white/85 bg-white/90 p-5 shadow-soft">
      <p className="text-text-main/60">הנקות בלילה</p><p className="text-5xl font-extrabold">{nightItems.length}</p>
      <p className="mt-2 text-sm text-text-main/60">{nightItems.map((item) => formatTime(item.startTime)).join(' · ') || 'לא נמצאו הנקות לילה'}</p>
    </div>
    <div className="space-y-3">
      {nightItems.map((item) => {
        const draft = getDraft(item);
        return <article key={item.id} className="rounded-3xl border border-white/85 bg-white/90 p-4 shadow-soft">
          <p className="font-extrabold">{formatDateTime(item.startTime)} · {formatDuration(item.totalDurationSeconds)}</p>
          {(item.needsReview || item.isIncomplete) && <div className="mt-3 space-y-2">
            <p className="text-sm font-bold text-primary-text">הנקה לא סגורה, אפשר לתקן עכשיו</p>
            <input className="field" type="datetime-local" value={draft.end} onChange={(e) => setDrafts({ ...drafts, [item.id]: { ...draft, end: e.target.value } })} />
            <div className="grid grid-cols-2 gap-2">
              <input className="field" type="number" value={draft.right} onChange={(e) => setDrafts({ ...drafts, [item.id]: { ...draft, right: Number(e.target.value) } })} placeholder="ימין בדקות" />
              <input className="field" type="number" value={draft.left} onChange={(e) => setDrafts({ ...drafts, [item.id]: { ...draft, left: Number(e.target.value) } })} placeholder="שמאל בדקות" />
            </div>
            <Button className="w-full" onClick={() => save(item)}>שמירת תיקון</Button>
          </div>}
        </article>;
      })}
    </div>
    <Button className="w-full" variant="secondary" onClick={onReviewed}>סימנתי את הלילה כנסקר</Button>
  </section>;
}
