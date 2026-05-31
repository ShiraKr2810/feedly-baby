import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppShell } from './components/layout/AppShell';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { FeedingTimer } from './pages/FeedingTimer';
import { FeedingJournal } from './pages/FeedingJournal';
import { Pumping } from './pages/Pumping';
import { Bottles } from './pages/Bottles';
import { Diapers } from './pages/Diapers';
import { Statistics } from './pages/Statistics';
import { NightSummary } from './pages/NightSummary';
import { Reminders } from './pages/Reminders';
import { Settings } from './pages/Settings';
import { useBabyData } from './hooks/useBabyData';
import { useNightMode } from './hooks/useNightMode';
import { useActiveTimer } from './hooks/useActiveTimer';
import { Page } from './types';
import { storageService } from './services/storageService';
import { activeTimerToFeedingSession } from './services/activeTimerUtils';
import { cancelReminderNotification, cancelReminderNotifications, reminderBaseline, rescheduleActiveReminderNotifications, scheduleReminderNotification } from './services/localNotificationService';

export default function App() {
  const { data, setData } = useBabyData();
  const [page, setPage] = useState<Page>('dashboard');
  const isNight = useNightMode(data.settings);
  const timer = useActiveTimer();

  if (!data.baby) {
    return <Onboarding onDone={(baby, settings) => setData((current) => ({ ...current, baby, settings }))} />;
  }

  const babyId = data.baby.id;
  const upsert = <T extends { id: string }>(items: T[], item: T) => {
    const exists = items.some((current) => current.id === item.id);
    return exists ? items.map((current) => (current.id === item.id ? item : current)) : [item, ...items];
  };

  const finishActiveFeeding = async (quick = false, note?: string) => {
    if (!timer.snapshot || timer.snapshot.type !== 'breastfeeding') return;
    const feeding = activeTimerToFeedingSession(timer.snapshot, quick, note);
    const feedings = [feeding, ...data.feedings];
    const reminders = await rescheduleActiveReminderNotifications(data.reminders, feedings, data.pumping);
    timer.clearTimer();
    setData((current) => ({ ...current, feedings: [feeding, ...current.feedings], reminders }));
    setPage(feeding.needsReview ? 'night' : 'dashboard');
  };

  const screen = (() => {
    switch (page) {
      case 'timer':
        return <FeedingTimer babyId={babyId} isNight={isNight} timer={timer} onCancel={() => setPage('dashboard')} onSave={finishActiveFeeding} />;
      case 'journal':
        return <FeedingJournal feedings={data.feedings} onUpdate={async (feeding) => { const feedings = data.feedings.map((item) => item.id === feeding.id ? feeding : item); const reminders = await rescheduleActiveReminderNotifications(data.reminders, feedings, data.pumping); setData((current) => ({ ...current, feedings, reminders })); }} onDelete={async (id) => { const feedings = data.feedings.filter((item) => item.id !== id); const reminders = await rescheduleActiveReminderNotifications(data.reminders, feedings, data.pumping); setData((current) => ({ ...current, feedings, reminders })); }} setPage={setPage} />;
      case 'pumping':
        return <Pumping babyId={babyId} items={data.pumping} setPage={setPage} onSave={async (item) => { const pumping = upsert(data.pumping, item); const reminders = await rescheduleActiveReminderNotifications(data.reminders, data.feedings, pumping); setData((current) => ({ ...current, pumping, reminders })); }} onDelete={async (id) => { const pumping = data.pumping.filter((item) => item.id !== id); const reminders = await rescheduleActiveReminderNotifications(data.reminders, data.feedings, pumping); setData((current) => ({ ...current, pumping, reminders })); }} />;
      case 'bottles':
        return <Bottles babyId={babyId} items={data.bottles} setPage={setPage} onSave={(item) => setData((current) => ({ ...current, bottles: upsert(current.bottles, item) }))} onDelete={(id) => setData((current) => ({ ...current, bottles: current.bottles.filter((item) => item.id !== id) }))} />;
      case 'diapers':
        return <Diapers babyId={babyId} items={data.diapers} setPage={setPage} onSave={(item) => setData((current) => ({ ...current, diapers: upsert(current.diapers, item) }))} onDelete={(id) => setData((current) => ({ ...current, diapers: current.diapers.filter((item) => item.id !== id) }))} />;
      case 'statistics':
        return <Statistics feedings={data.feedings} pumping={data.pumping} bottles={data.bottles} settings={data.settings} />;
      case 'night':
        return <NightSummary feedings={data.feedings} settings={data.settings} onReviewed={() => { setData((current) => ({ ...current, settings: { ...current.settings, reviewedNightKey: new Date().toISOString().slice(0, 10) } })); setPage('dashboard'); }} onUpdate={async (feeding) => { const feedings = data.feedings.map((item) => item.id === feeding.id ? feeding : item); const reminders = await rescheduleActiveReminderNotifications(data.reminders, feedings, data.pumping); setData((current) => ({ ...current, feedings, reminders })); }} />;
      case 'reminders':
        return <Reminders babyId={babyId} reminders={data.reminders} feedings={data.feedings} pumping={data.pumping} onSave={async (item) => { const scheduled = await scheduleReminderNotification(item, reminderBaseline(item, data.feedings, data.pumping)); setData((current) => ({ ...current, reminders: [scheduled, ...current.reminders] })); }} onDelete={async (id) => { const reminder = data.reminders.find((item) => item.id === id); if (reminder) await cancelReminderNotification(reminder); setData((current) => ({ ...current, reminders: current.reminders.filter((item) => item.id !== id) })); }} onToggle={async (item) => { const updated = { ...item, isActive: !item.isActive }; if (updated.isActive) { const scheduled = await scheduleReminderNotification(updated, reminderBaseline(updated, data.feedings, data.pumping)); setData((current) => ({ ...current, reminders: current.reminders.map((reminder) => reminder.id === item.id ? scheduled : reminder) })); } else { await cancelReminderNotification(item); setData((current) => ({ ...current, reminders: current.reminders.map((reminder) => reminder.id === item.id ? updated : reminder) })); } }} />;
      case 'settings':
        return <Settings baby={data.baby} settings={data.settings} onBaby={(baby) => setData((current) => ({ ...current, baby }))} onSettings={(settings) => setData((current) => ({ ...current, settings }))} onReset={async () => { await cancelReminderNotifications(data.reminders); timer.clearTimer(); storageService.resetAll(); setData((current) => ({ ...current, baby: null, feedings: [], pumping: [], bottles: [], diapers: [], reminders: [] })); }} />;
      default:
        return <Dashboard baby={data.baby} feedings={data.feedings} settings={data.settings} isNight={isNight} activeTimer={timer.snapshot} onFinishActiveTimer={() => finishActiveFeeding(false)} onCancelActiveTimer={timer.clearTimer} setPage={setPage} />;
    }
  })();

  return (
    <AppShell page={page} setPage={setPage} isNight={isNight}>
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
        >
          {screen}
        </motion.div>
      </AnimatePresence>
    </AppShell>
  );
}
