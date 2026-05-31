import { ActiveTimer, Baby, FeedingSession, Page, AppSettings } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { formatDuration, formatTime, getBabyAge, greeting, isNightSession, isSameDay, timeAgo } from '../services/dateUtils';
import { latestCompletedFeeding, recommendedSide, sideLabel } from '../services/feedingUtils';
import { Baby as BabyIcon, BellRing, Moon, Milk, Plus, Droplets, TimerReset, Trash2 } from 'lucide-react';

export function Dashboard({
  baby,
  feedings,
  settings,
  isNight,
  activeTimer,
  onFinishActiveTimer,
  onCancelActiveTimer,
  setPage,
}: {
  baby: Baby;
  feedings: FeedingSession[];
  settings: AppSettings;
  isNight: boolean;
  activeTimer: ActiveTimer | null;
  onFinishActiveTimer: () => void;
  onCancelActiveTimer: () => void;
  setPage: (page: Page) => void;
}) {
  const latest = latestCompletedFeeding(feedings);
  const today = feedings.filter((feeding) => isSameDay(feeding.startTime));
  const unfinished = feedings.filter((feeding) => feeding.isIncomplete || feeding.needsReview);
  const nightCount = feedings.filter((feeding) => isNightSession(feeding.startTime, settings.nightStart, settings.nightEnd) && isSameDay(feeding.startTime)).length;
  const nextSide = sideLabel(recommendedSide(feedings));

  if (isNight) {
    return (
      <section className="space-y-5 pt-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-white/55">Feedly Baby</p>
            <h1 className="text-3xl font-extrabold">לילה שקט, {baby.name}</h1>
          </div>
          <div className="rounded-2xl bg-primary/15 p-3 text-primary-text"><Moon /></div>
        </div>
        {activeTimer && <ActiveTimerRecovery timer={activeTimer} isNight onContinue={() => setPage('timer')} onFinish={onFinishActiveTimer} onCancel={onCancelActiveTimer} />}
        {unfinished.length > 0 && (
          <button onClick={() => setPage('night')} className="w-full rounded-3xl border border-primary/25 bg-primary/10 p-4 text-right shadow-night">
            <p className="font-extrabold text-primary-text">יש הנקה שממתינה לסגירה בבוקר</p>
            <p className="text-sm text-white/60">אפשר להשלים משך וזמנים במסך סיכום הלילה.</p>
          </button>
        )}
        <div className="rounded-[2rem] bg-night-card p-5 shadow-night">
          <p className="text-white/55">האכלה אחרונה</p>
          <div className="mt-2 text-5xl font-extrabold">{latest ? timeAgo(latest.endTime ?? latest.startTime) : 'אין עדיין'}</div>
          <p className="mt-3 text-lg text-white/70">להתחיל מצד {nextSide}</p>
        </div>
        <Button variant="night" className="h-28 w-full rounded-[2rem] text-2xl" icon={<Milk size={30} />} onClick={() => setPage('timer')}>
          התחלתי הנקה
        </Button>
        <div className="grid grid-cols-3 gap-3">
          <Button variant="secondary" className="bg-white/10 text-white" onClick={() => setPage('pumping')}>שאיבה</Button>
          <Button variant="secondary" className="bg-white/10 text-white" onClick={() => setPage('bottles')}>בקבוק</Button>
          <Button variant="secondary" className="bg-white/10 text-white" onClick={() => setPage('diapers')}>טיטול</Button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <header className="rounded-[2rem] border border-white/85 bg-white/90 p-5 shadow-soft">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-bold text-primary-hover">{greeting()}</p>
            <h1 className="mt-1 text-3xl font-extrabold">{baby.name}</h1>
            <p className="mt-1 text-text-main/60">גיל: {getBabyAge(baby.birthDate)}</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/25 text-primary-hover"><BabyIcon /></div>
        </div>
        <Button className="mt-5 w-full text-lg" icon={<Milk />} onClick={() => setPage('timer')}>התחלתי הנקה</Button>
      </header>

      {activeTimer && <ActiveTimerRecovery timer={activeTimer} onContinue={() => setPage('timer')} onFinish={onFinishActiveTimer} onCancel={onCancelActiveTimer} />}

      {unfinished.length > 0 && (
        <button onClick={() => setPage('night')} className="w-full rounded-3xl border border-pink/45 bg-pink-surface p-4 text-right text-primary-text">
          <div className="flex items-center gap-2 font-extrabold"><BellRing size={20} /> יש הנקה לא גמורה מהלילה</div>
          <p className="mt-1 text-sm text-text-main/60">אפשר לתקן ולסמן את הלילה כנסקר.</p>
        </button>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="text-sm font-bold text-text-main/55">האכלה אחרונה</p>
          <p className="mt-2 text-2xl font-extrabold">{formatTime(latest?.endTime ?? latest?.startTime)}</p>
          <p className="text-sm text-text-main/55">{timeAgo(latest?.endTime ?? latest?.startTime)}</p>
        </Card>
        <Card>
          <p className="text-sm font-bold text-text-main/55">הצד הבא</p>
          <p className="mt-2 text-3xl font-extrabold">{nextSide}</p>
          <p className="text-sm text-text-main/55">המלצה לפי ההנקה האחרונה</p>
        </Card>
        <Card>
          <p className="text-sm font-bold text-text-main/55">הנקות היום</p>
          <p className="mt-2 text-3xl font-extrabold">{today.length}</p>
          <p className="text-sm text-text-main/55">סה״כ {formatDuration(today.reduce((sum, item) => sum + item.totalDurationSeconds, 0))}</p>
        </Card>
        <Card>
          <p className="text-sm font-bold text-text-main/55">מצב לילה</p>
          <p className="mt-2 text-3xl font-extrabold">{isNight ? 'פעיל' : 'כבוי'}</p>
          <p className="text-sm text-text-main/55">הלילה: {nightCount} הנקות</p>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Button variant="secondary" className="flex-col px-2" icon={<Plus />} onClick={() => setPage('pumping')}>הוספת שאיבה</Button>
        <Button variant="secondary" className="flex-col px-2" icon={<Milk />} onClick={() => setPage('bottles')}>הוספת בקבוק</Button>
        <Button variant="secondary" className="flex-col px-2" icon={<Droplets />} onClick={() => setPage('diapers')}>הוספת טיטול</Button>
      </div>
    </section>
  );
}

function ActiveTimerRecovery({ timer, isNight = false, onContinue, onFinish, onCancel }: { timer: ActiveTimer; isNight?: boolean; onContinue: () => void; onFinish: () => void; onCancel: () => void }) {
  const title = timer.type === 'breastfeeding' ? 'יש הנקה פעילה' : 'יש שאיבה פעילה';
  return (
    <div className={`rounded-3xl p-4 shadow-soft ${isNight ? 'border border-night-blue/20 bg-night-card' : 'border border-primary/50 bg-blue-surface'}`}>
      <div className="mb-3 flex items-center gap-2">
        <TimerReset size={20} />
        <p className="font-extrabold">{title}</p>
      </div>
      <div className="grid gap-2">
        <Button variant={isNight ? 'night' : 'primary'} className="w-full" onClick={onContinue}>המשך טיימר</Button>
        {timer.type === 'breastfeeding' && <Button variant="secondary" className="w-full" onClick={onFinish}>סיים ושמור</Button>}
        <Button variant="ghost" className={isNight ? 'text-white/70' : 'text-text-muted'} icon={<Trash2 size={16} />} onClick={onCancel}>בטלי טיימר</Button>
      </div>
    </div>
  );
}
