export type Side = 'right' | 'left' | 'both';

export interface Baby {
  id: string;
  name: string;
  birthDate: string;
  createdAt: string;
}

export interface FeedingSession {
  id: string;
  babyId: string;
  startTime: string;
  endTime?: string;
  startSide: Side;
  rightDurationSeconds: number;
  leftDurationSeconds: number;
  totalDurationSeconds: number;
  note?: string;
  isIncomplete?: boolean;
  needsReview?: boolean;
  createdAt: string;
}

export interface PumpingSession {
  id: string;
  babyId: string;
  time: string;
  side: Side;
  amountMl: number;
  note?: string;
  createdAt: string;
}

export interface BottleSession {
  id: string;
  babyId: string;
  time: string;
  type: 'breast_milk' | 'formula' | 'other';
  amountMl: number;
  note?: string;
  createdAt: string;
}

export interface DiaperLog {
  id: string;
  babyId: string;
  time: string;
  type: 'wet' | 'dirty' | 'both';
  note?: string;
  createdAt: string;
}

export interface Reminder {
  id: string;
  babyId: string;
  type: 'feeding' | 'pumping';
  title: string;
  intervalMinutes?: number;
  specificTime?: string;
  isActive: boolean;
  createdAt: string;
}

export interface AppSettings {
  nightStart: string;
  nightEnd: string;
  themeMode: 'light' | 'dark' | 'auto';
  reviewedNightKey?: string;
}

export interface BabyData {
  baby: Baby | null;
  feedings: FeedingSession[];
  pumping: PumpingSession[];
  bottles: BottleSession[];
  diapers: DiaperLog[];
  reminders: Reminder[];
  settings: AppSettings;
}

export type Page =
  | 'dashboard'
  | 'timer'
  | 'journal'
  | 'pumping'
  | 'bottles'
  | 'diapers'
  | 'statistics'
  | 'night'
  | 'reminders'
  | 'settings';
