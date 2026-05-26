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
import { Page } from './types';
import { storageService } from './services/storageService';

export default function App() {
  const { data, setData } = useBabyData();
  const [page, setPage] = useState<Page>('dashboard');
  const isNight = useNightMode(data.settings);

  if (!data.baby) {
    return <Onboarding onDone={(baby, settings) => setData((current) => ({ ...current, baby, settings }))} />;
  }

  const babyId = data.baby.id;
  const upsert = <T extends { id: string }>(items: T[], item: T) => {
    const exists = items.some((current) => current.id === item.id);
    return exists ? items.map((current) => (current.id === item.id ? item : current)) : [item, ...items];
  };

  const screen = (() => {
    switch (page) {
      case 'timer':
        return <FeedingTimer babyId={babyId} isNight={isNight} onCancel={() => setPage('dashboard')} onSave={(feeding) => { setData((current) => ({ ...current, feedings: [feeding, ...current.feedings] })); setPage(feeding.needsReview ? 'night' : 'dashboard'); }} />;
      case 'journal':
        return <FeedingJournal feedings={data.feedings} onUpdate={(feeding) => setData((current) => ({ ...current, feedings: current.feedings.map((item) => item.id === feeding.id ? feeding : item) }))} onDelete={(id) => setData((current) => ({ ...current, feedings: current.feedings.filter((item) => item.id !== id) }))} setPage={setPage} />;
      case 'pumping':
        return <Pumping babyId={babyId} items={data.pumping} setPage={setPage} onSave={(item) => setData((current) => ({ ...current, pumping: upsert(current.pumping, item) }))} onDelete={(id) => setData((current) => ({ ...current, pumping: current.pumping.filter((item) => item.id !== id) }))} />;
      case 'bottles':
        return <Bottles babyId={babyId} items={data.bottles} setPage={setPage} onSave={(item) => setData((current) => ({ ...current, bottles: upsert(current.bottles, item) }))} onDelete={(id) => setData((current) => ({ ...current, bottles: current.bottles.filter((item) => item.id !== id) }))} />;
      case 'diapers':
        return <Diapers babyId={babyId} items={data.diapers} setPage={setPage} onSave={(item) => setData((current) => ({ ...current, diapers: upsert(current.diapers, item) }))} onDelete={(id) => setData((current) => ({ ...current, diapers: current.diapers.filter((item) => item.id !== id) }))} />;
      case 'statistics':
        return <Statistics feedings={data.feedings} pumping={data.pumping} bottles={data.bottles} settings={data.settings} />;
      case 'night':
        return <NightSummary feedings={data.feedings} settings={data.settings} onReviewed={() => { setData((current) => ({ ...current, settings: { ...current.settings, reviewedNightKey: new Date().toISOString().slice(0, 10) } })); setPage('dashboard'); }} onUpdate={(feeding) => setData((current) => ({ ...current, feedings: current.feedings.map((item) => item.id === feeding.id ? feeding : item) }))} />;
      case 'reminders':
        return <Reminders babyId={babyId} reminders={data.reminders} onSave={(item) => setData((current) => ({ ...current, reminders: [item, ...current.reminders] }))} onDelete={(id) => setData((current) => ({ ...current, reminders: current.reminders.filter((item) => item.id !== id) }))} />;
      case 'settings':
        return <Settings baby={data.baby} settings={data.settings} onBaby={(baby) => setData((current) => ({ ...current, baby }))} onSettings={(settings) => setData((current) => ({ ...current, settings }))} onReset={() => { storageService.resetAll(); setData((current) => ({ ...current, baby: null, feedings: [], pumping: [], bottles: [], diapers: [], reminders: [] })); }} />;
      default:
        return <Dashboard baby={data.baby} feedings={data.feedings} settings={data.settings} isNight={isNight} setPage={setPage} />;
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
