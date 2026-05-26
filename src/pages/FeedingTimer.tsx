import { useState } from 'react';
import { FeedingSession, Side } from '../types';
import { Button } from '../components/ui/Button';
import { useFeedingTimer } from '../hooks/useFeedingTimer';
import { sideLabel } from '../services/feedingUtils';
import { formatDuration, timerText } from '../services/dateUtils';
import { uid } from '../services/storageService';
import { ArrowLeftRight, Check, Pause, Play } from 'lucide-react';

export function FeedingTimer({
  babyId,
  isNight,
  onSave,
  onCancel,
}: {
  babyId: string;
  isNight: boolean;
  onSave: (feeding: FeedingSession) => void;
  onCancel: () => void;
}) {
  const [startSide, setStartSide] = useState<Side | null>(null);
  const [summary, setSummary] = useState(false);
  const [note, setNote] = useState('');
  const [startedAt] = useState(new Date().toISOString());
  const timer = useFeedingTimer(startSide ?? 'right');

  const finish = (quick = false) => {
    const feeding: FeedingSession = {
      id: uid(),
      babyId,
      startTime: startedAt,
      endTime: quick ? undefined : new Date().toISOString(),
      startSide: startSide ?? 'right',
      rightDurationSeconds: timer.rightSeconds,
      leftDurationSeconds: timer.leftSeconds,
      totalDurationSeconds: timer.totalSeconds,
      note: note.trim() || undefined,
      isIncomplete: quick,
      needsReview: quick,
      createdAt: new Date().toISOString(),
    };
    onSave(feeding);
  };

  if (!startSide) {
    return (
      <section className="space-y-5 pt-8">
        <div>
          <p className={isNight ? 'text-white/55' : 'text-primary-hover'}>בחירת צד התחלה</p>
          <h1 className="text-3xl font-extrabold">מאיפה מתחילים?</h1>
        </div>
        <div className="grid gap-3">
          {(['right', 'left', 'both'] as Side[]).map((side) => (
            <Button key={side} variant={isNight ? 'night' : 'primary'} className="h-20 text-xl" onClick={() => setStartSide(side)}>
              {sideLabel(side)}
            </Button>
          ))}
        </div>
        <Button variant="ghost" className={isNight ? 'text-white/70' : ''} onClick={onCancel}>חזרה</Button>
      </section>
    );
  }

  if (summary) {
    return (
      <section className="space-y-4 pt-5">
        <h1 className="text-3xl font-extrabold">סיכום הנקה</h1>
        <div className={`rounded-[2rem] p-6 shadow-soft ${isNight ? 'border border-night-blue/20 bg-night-card' : 'border border-line bg-card'}`}>
          <div className="text-center">
            <p className={isNight ? 'text-white/55' : 'text-text-main/55'}>משך כולל</p>
            <p className="text-5xl font-extrabold">{formatDuration(timer.totalSeconds)}</p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-3xl bg-white/20 p-4">ימין<br /><b>{formatDuration(timer.rightSeconds)}</b></div>
            <div className="rounded-3xl bg-white/20 p-4">שמאל<br /><b>{formatDuration(timer.leftSeconds)}</b></div>
          </div>
          <p className="mt-4 text-center text-sm opacity-70">צד התחלה: {sideLabel(startSide)}</p>
        </div>
        {!isNight && (
          <label className="block">
            <span className="mb-1 block text-sm font-bold opacity-65">הערה</span>
            <textarea className="field min-h-24" value={note} onChange={(event) => setNote(event.target.value)} placeholder="משהו שחשוב לזכור" />
          </label>
        )}
        <Button className="w-full" variant={isNight ? 'night' : 'primary'} icon={<Check />} onClick={() => finish(false)}>שמירה</Button>
        {isNight && <Button className="w-full" variant="secondary" onClick={() => finish(true)}>שמרי מהר ואשלים בבוקר</Button>}
      </section>
    );
  }

  return (
    <section className="flex min-h-[76vh] flex-col justify-between pt-5">
      <div className="text-center">
        <p className={isNight ? 'text-white/55' : 'text-primary-hover'}>הנקה פעילה</p>
        <h1 className="text-2xl font-extrabold">צד נוכחי: {sideLabel(timer.activeSide)}</h1>
      </div>
      <div className={`mx-auto flex h-64 w-64 flex-col items-center justify-center rounded-full shadow-soft ${isNight ? 'border border-night-blue/20 bg-night-card' : 'border border-line bg-card'}`}>
        <p className="text-sm font-bold opacity-60">משך</p>
        <p className="text-5xl font-extrabold tabular-nums">{timerText(timer.totalSeconds)}</p>
        <p className="mt-2 text-sm opacity-60">ימין {timerText(timer.rightSeconds)} · שמאל {timerText(timer.leftSeconds)}</p>
      </div>
      <div className="space-y-3">
        <Button className="h-16 w-full text-lg" variant={isNight ? 'night' : 'primary'} icon={<ArrowLeftRight />} onClick={() => timer.setActiveSide(timer.activeSide === 'right' ? 'left' : 'right')}>
          החלפת צד
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" icon={timer.isPaused ? <Play /> : <Pause />} onClick={() => timer.setPaused(!timer.isPaused)}>
            {timer.isPaused ? 'המשך' : 'השהיה'}
          </Button>
          <Button variant={isNight ? 'night' : 'primary'} onClick={() => setSummary(true)}>סיום</Button>
        </div>
        {isNight && <Button className="w-full" variant="secondary" onClick={() => finish(true)}>שמרי מהר ואשלים בבוקר</Button>}
      </div>
    </section>
  );
}
