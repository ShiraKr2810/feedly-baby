import { useState } from 'react';
import { Side } from '../types';
import { Button } from '../components/ui/Button';
import type { ActiveTimerController } from '../hooks/useActiveTimer';
import { sideLabel } from '../services/feedingUtils';
import { formatDuration, timerText } from '../services/dateUtils';
import { ArrowLeftRight, Check, Pause, Play, Trash2 } from 'lucide-react';

export function FeedingTimer({
  babyId,
  isNight,
  timer,
  onSave,
  onCancel,
}: {
  babyId: string;
  isNight: boolean;
  timer: ActiveTimerController;
  onSave: (quick: boolean, note?: string) => void;
  onCancel: () => void;
}) {
  const [summary, setSummary] = useState(false);
  const [note, setNote] = useState('');
  const active = timer.snapshot?.type === 'breastfeeding' ? timer.snapshot : null;

  if (!active) {
    return (
      <section className="space-y-5 pt-8">
        <div>
          <p className={isNight ? 'text-white/55' : 'text-primary-hover'}>בחירת צד התחלה</p>
          <h1 className="text-3xl font-extrabold">מאיפה מתחילים?</h1>
        </div>
        <div className="grid gap-3">
          {(['right', 'left', 'both'] as Side[]).map((side) => (
            <Button key={side} variant={isNight ? 'night' : 'primary'} className="h-20 text-xl" onClick={() => timer.startBreastfeeding(babyId, side)}>
              {sideLabel(side)}
            </Button>
          ))}
        </div>
        <Button variant="ghost" className={isNight ? 'text-white/70' : ''} onClick={onCancel}>חזרה</Button>
      </section>
    );
  }

  const totalSeconds = active.rightDurationSeconds + active.leftDurationSeconds;

  if (summary) {
    return (
      <section className="space-y-4 pt-5">
        <h1 className="text-3xl font-extrabold">סיכום הנקה</h1>
        <div className="theme-card rounded-[2rem] p-6">
          <div className="text-center">
            <p className="theme-muted">משך כולל</p>
            <p className="text-5xl font-extrabold">{formatDuration(totalSeconds)}</p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-3xl bg-blue-surface/70 p-4 text-primary-text">ימין<br /><b>{formatDuration(active.rightDurationSeconds)}</b></div>
            <div className="rounded-3xl bg-pink-surface/70 p-4 text-primary-text">שמאל<br /><b>{formatDuration(active.leftDurationSeconds)}</b></div>
          </div>
          <p className="mt-4 text-center text-sm opacity-70">צד התחלה: {sideLabel(active.startSide ?? 'right')}</p>
        </div>
        {!isNight && (
          <label className="block">
            <span className="theme-muted mb-1 block text-sm font-bold">הערה</span>
            <textarea className="field min-h-24" value={note} onChange={(event) => setNote(event.target.value)} placeholder="משהו שחשוב לזכור" />
          </label>
        )}
        <Button className="w-full" variant={isNight ? 'night' : 'primary'} icon={<Check />} onClick={() => onSave(false, note)}>שמירה</Button>
        {isNight && <Button className="w-full" variant="secondary" onClick={() => onSave(true)}>שמרי מהר ואשלים בבוקר</Button>}
      </section>
    );
  }

  return (
    <section className="flex min-h-[76vh] flex-col justify-between pt-5">
      <div className="text-center">
        <p className={isNight ? 'text-white/55' : 'text-primary-hover'}>הנקה פעילה</p>
        <h1 className="text-2xl font-extrabold">צד נוכחי: {sideLabel(active.currentSide ?? 'right')}</h1>
      </div>
      <div className="theme-card mx-auto flex h-64 w-64 flex-col items-center justify-center rounded-full">
        <p className="text-sm font-bold opacity-60">משך</p>
        <p className="text-5xl font-extrabold tabular-nums">{timerText(totalSeconds)}</p>
        <p className="mt-2 text-sm opacity-60">ימין {timerText(active.rightDurationSeconds)} · שמאל {timerText(active.leftDurationSeconds)}</p>
      </div>
      <div className="space-y-3">
        <Button className="h-16 w-full text-lg" variant={isNight ? 'night' : 'primary'} icon={<ArrowLeftRight />} onClick={timer.switchSide}>
          החלפת צד
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" icon={active.isPaused ? <Play /> : <Pause />} onClick={timer.togglePause}>
            {active.isPaused ? 'המשך' : 'השהיה'}
          </Button>
          <Button variant={isNight ? 'night' : 'primary'} onClick={() => setSummary(true)}>סיום</Button>
        </div>
        {isNight && <Button className="w-full" variant="secondary" onClick={() => onSave(true)}>שמרי מהר ואשלים בבוקר</Button>}
        <Button variant="ghost" className={`w-full ${isNight ? 'text-white/65' : 'text-text-muted'}`} icon={<Trash2 size={17} />} onClick={() => { timer.clearTimer(); onCancel(); }}>
          ביטול טיימר
        </Button>
      </div>
    </section>
  );
}
