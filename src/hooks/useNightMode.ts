import { useEffect, useState } from 'react';
import { AppSettings } from '../types';
import { isWithinNightHours } from '../services/dateUtils';

export function useNightMode(settings: AppSettings) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((value) => value + 1), 60000);
    return () => window.clearInterval(id);
  }, []);

  const autoNight = isWithinNightHours(settings.nightStart, settings.nightEnd);
  void tick;
  return settings.themeMode === 'dark' || (settings.themeMode === 'auto' && autoNight);
}
