import { BarChart3, Bell, BookOpen, Home, Settings } from 'lucide-react';
import { Page } from '../../types';

const items: { page: Page; label: string; Icon: typeof Home }[] = [
  { page: 'dashboard', label: 'בית', Icon: Home },
  { page: 'journal', label: 'יומן', Icon: BookOpen },
  { page: 'statistics', label: 'סטטיסטיקות', Icon: BarChart3 },
  { page: 'reminders', label: 'תזכורות', Icon: Bell },
  { page: 'settings', label: 'הגדרות', Icon: Settings },
];

export function BottomNav({ page, onChange, isNight }: { page: Page; onChange: (page: Page) => void; isNight: boolean }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px] px-4 pb-3">
      <div className={`grid grid-cols-5 rounded-3xl border p-2 shadow-soft backdrop-blur-xl ${isNight ? 'border-night-blue/15 bg-night-card/95' : 'border-line bg-white/90'}`}>
        {items.map(({ page: itemPage, label, Icon }) => {
          const active = page === itemPage || (itemPage === 'journal' && ['pumping', 'bottles', 'diapers'].includes(page));
          return (
            <button
              key={itemPage}
              onClick={() => onChange(itemPage)}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-bold transition ${
                active
                  ? isNight
                    ? 'bg-night-blue text-primary-text'
                    : 'bg-primary text-primary-text shadow-lift'
                  : isNight
                    ? 'text-white/60 hover:bg-white/10'
                    : 'text-text-muted hover:bg-blue-surface'
              }`}
              aria-label={label}
            >
              <Icon size={20} />
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
