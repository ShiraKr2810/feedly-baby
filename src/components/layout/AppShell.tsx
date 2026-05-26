import { PropsWithChildren } from 'react';
import { Page } from '../../types';
import { BottomNav } from './BottomNav';

export function AppShell({
  children,
  page,
  setPage,
  isNight,
}: PropsWithChildren<{ page: Page; setPage: (page: Page) => void; isNight: boolean }>) {
  return (
    <main dir="rtl" className={`min-h-screen ${isNight ? 'bg-night text-white' : 'bg-app text-text-main'}`}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className={`absolute -right-20 top-[-120px] h-72 w-72 rounded-full blur-3xl ${isNight ? 'bg-night-blue/10' : 'bg-primary/35'}`} />
        <div className={`absolute -left-24 top-40 h-64 w-64 rounded-full blur-3xl ${isNight ? 'bg-night-pink/10' : 'bg-pink/25'}`} />
      </div>
      <div className="relative mx-auto min-h-screen max-w-[480px] px-4 pb-28 pt-4">
        {children}
      </div>
      <BottomNav page={page} onChange={setPage} isNight={isNight} />
    </main>
  );
}
