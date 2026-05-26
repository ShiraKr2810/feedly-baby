export const pad = (value: number) => value.toString().padStart(2, '0');

export const formatTime = (iso?: string) =>
  iso ? new Intl.DateTimeFormat('he-IL', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jerusalem' }).format(new Date(iso)) : 'אין עדיין';

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'long', timeZone: 'Asia/Jerusalem' }).format(new Date(iso));

export const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat('he-IL', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jerusalem',
  }).format(new Date(iso));

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours > 0) return `${hours} ש׳ ${rest} דק׳`;
  return `${minutes} דק׳`;
};

export const timerText = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}:${pad(seconds % 60)}`;
};

export const timeAgo = (iso?: string) => {
  if (!iso) return 'אין נתונים';
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'עכשיו';
  if (minutes < 60) return `לפני ${minutes} דק׳`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `לפני ${hours} ש׳ ו-${rest} דק׳` : `לפני ${hours} ש׳`;
};

export const todayKey = (date = new Date()) => date.toISOString().slice(0, 10);

export const isSameDay = (iso: string, day = new Date()) => todayKey(new Date(iso)) === todayKey(day);

export const getBabyAge = (birthDate?: string) => {
  if (!birthDate) return '';
  const birth = new Date(birthDate);
  const now = new Date();
  const days = Math.max(0, Math.floor((now.getTime() - birth.getTime()) / 86400000));
  if (days < 14) return `${days} ימים`;
  if (days < 70) return `${Math.floor(days / 7)} שבועות`;
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth();
  return `${Math.max(1, months)} חודשים`;
};

const minutesFromClock = (clock: string) => {
  const [h, m] = clock.split(':').map(Number);
  return h * 60 + m;
};

export const isWithinNightHours = (start: string, end: string, date = new Date()) => {
  const now = date.getHours() * 60 + date.getMinutes();
  const from = minutesFromClock(start);
  const to = minutesFromClock(end);
  return from > to ? now >= from || now < to : now >= from && now < to;
};

export const isNightSession = (iso: string, start: string, end: string) => isWithinNightHours(start, end, new Date(iso));

export const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'בוקר טוב';
  if (hour < 17) return 'צהריים טובים';
  if (hour < 21) return 'ערב טוב';
  return 'לילה שקט';
};

const israelTimeZone = 'Asia/Jerusalem';

const israelDateParts = (date: Date) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: israelTimeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? '00';
  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    hour: get('hour') === '24' ? '00' : get('hour'),
    minute: get('minute'),
  };
};

export const isoToIsraelDateTimeInputValue = (iso: string) => {
  const parts = israelDateParts(new Date(iso));
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
};

export const getCurrentIsraelDateTimeInputValue = () => isoToIsraelDateTimeInputValue(new Date().toISOString());

const timeZoneOffsetMs = (date: Date) => {
  const parts = israelDateParts(date);
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
  );
  return asUtc - date.getTime();
};

export const israelDateTimeInputToIso = (value: string) => {
  const [datePart, timePart] = value.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  const utcWallTime = Date.UTC(year, month - 1, day, hour, minute);
  let instant = new Date(utcWallTime);

  for (let i = 0; i < 2; i += 1) {
    instant = new Date(utcWallTime - timeZoneOffsetMs(instant));
  }

  return instant.toISOString();
};
