import { AppSettings, Baby, BottleSession, DiaperLog, FeedingSession, PumpingSession, Reminder } from '../types';

const keys = {
  baby: 'feedly:baby',
  feedings: 'feedly:feedings',
  pumping: 'feedly:pumping',
  bottles: 'feedly:bottles',
  diapers: 'feedly:diapers',
  reminders: 'feedly:reminders',
  settings: 'feedly:settings',
};

export const defaultSettings: AppSettings = {
  nightStart: '20:00',
  nightEnd: '06:00',
  themeMode: 'auto',
};

const read = <T,>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = <T,>(key: string, value: T) => localStorage.setItem(key, JSON.stringify(value));

export const storageService = {
  loadBaby: () => read<Baby | null>(keys.baby, null),
  saveBaby: (baby: Baby | null) => write(keys.baby, baby),
  loadFeedings: () => read<FeedingSession[]>(keys.feedings, []),
  saveFeedings: (items: FeedingSession[]) => write(keys.feedings, items),
  loadPumping: () => read<PumpingSession[]>(keys.pumping, []),
  savePumping: (items: PumpingSession[]) => write(keys.pumping, items),
  loadBottles: () => read<BottleSession[]>(keys.bottles, []),
  saveBottles: (items: BottleSession[]) => write(keys.bottles, items),
  loadDiapers: () => read<DiaperLog[]>(keys.diapers, []),
  saveDiapers: (items: DiaperLog[]) => write(keys.diapers, items),
  loadReminders: () => read<Reminder[]>(keys.reminders, []),
  saveReminders: (items: Reminder[]) => write(keys.reminders, items),
  loadSettings: () => ({ ...defaultSettings, ...read<Partial<AppSettings>>(keys.settings, {}) }),
  saveSettings: (settings: AppSettings) => write(keys.settings, settings),
  exportAll: () => ({
    baby: storageService.loadBaby(),
    feedings: storageService.loadFeedings(),
    pumping: storageService.loadPumping(),
    bottles: storageService.loadBottles(),
    diapers: storageService.loadDiapers(),
    reminders: storageService.loadReminders(),
    settings: storageService.loadSettings(),
  }),
  resetAll: () => Object.values(keys).forEach((key) => localStorage.removeItem(key)),
};

export const uid = () => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
