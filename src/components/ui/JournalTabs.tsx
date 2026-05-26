import { Page } from '../../types';

const tabs: { page: Page; label: string }[] = [
  { page: 'journal', label: 'הנקות' },
  { page: 'pumping', label: 'שאיבה' },
  { page: 'bottles', label: 'בקבוקים' },
  { page: 'diapers', label: 'טיטולים' },
];

export function JournalTabs({ active, onChange }: { active: Page; onChange: (page: Page) => void }) {
  return (
    <div className="grid grid-cols-4 gap-1 rounded-3xl border border-line bg-white/80 p-1.5 shadow-lift">
      {tabs.map((tab) => {
        const isActive = tab.page === active;
        return (
          <button
            key={tab.page}
            type="button"
            onClick={() => onChange(tab.page)}
            className={`min-h-11 rounded-2xl px-2 text-sm font-extrabold transition ${
              isActive ? 'bg-primary text-primary-text shadow-lift' : 'text-text-muted hover:bg-blue-surface'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
