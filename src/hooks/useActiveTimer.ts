import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActiveTimer, Side } from '../types';

const ACTIVE_TIMER_KEY = 'feedly:active-timer';

const nowIso = (timestamp = Date.now()) => new Date(timestamp).toISOString();

const readActiveTimer = (): ActiveTimer | null => {
  try {
    const stored = localStorage.getItem(ACTIVE_TIMER_KEY);
    return stored ? JSON.parse(stored) as ActiveTimer : null;
  } catch {
    return null;
  }
};

export const materializeActiveTimer = (timer: ActiveTimer, timestamp = Date.now()): ActiveTimer => {
  if (timer.isPaused) return timer;
  const elapsedSeconds = Math.max(0, Math.floor((timestamp - new Date(timer.lastUpdatedAt).getTime()) / 1000));
  if (!elapsedSeconds) return timer;

  if (timer.type === 'pumping') {
    return { ...timer, pumpingDurationSeconds: timer.pumpingDurationSeconds + elapsedSeconds, lastUpdatedAt: nowIso(timestamp) };
  }

  return {
    ...timer,
    rightDurationSeconds: timer.rightDurationSeconds + (timer.currentSide === 'right' ? elapsedSeconds : 0),
    leftDurationSeconds: timer.leftDurationSeconds + (timer.currentSide === 'left' ? elapsedSeconds : 0),
    lastUpdatedAt: nowIso(timestamp),
  };
};

export function useActiveTimer() {
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(readActiveTimer);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (activeTimer) localStorage.setItem(ACTIVE_TIMER_KEY, JSON.stringify(activeTimer));
    else localStorage.removeItem(ACTIVE_TIMER_KEY);
  }, [activeTimer]);

  useEffect(() => {
    if (!activeTimer || activeTimer.isPaused) return undefined;
    const interval = window.setInterval(() => setTick((value) => value + 1), 1000);
    return () => window.clearInterval(interval);
  }, [activeTimer?.isPaused, activeTimer?.startTime]);

  const snapshot = useMemo(() => activeTimer ? materializeActiveTimer(activeTimer) : null, [activeTimer, tick]);

  const startBreastfeeding = useCallback((babyId: string, startSide: Side) => {
    const timestamp = nowIso();
    setActiveTimer({
      type: 'breastfeeding',
      babyId,
      startTime: timestamp,
      startSide,
      currentSide: startSide === 'left' ? 'left' : 'right',
      rightDurationSeconds: 0,
      leftDurationSeconds: 0,
      pumpingDurationSeconds: 0,
      isPaused: false,
      accumulatedPausedDurationSeconds: 0,
      lastUpdatedAt: timestamp,
    });
  }, []);

  const switchSide = useCallback(() => {
    setActiveTimer((current) => {
      if (!current || current.type !== 'breastfeeding') return current;
      const materialized = materializeActiveTimer(current);
      return { ...materialized, currentSide: materialized.currentSide === 'right' ? 'left' : 'right' };
    });
  }, []);

  const togglePause = useCallback(() => {
    setActiveTimer((current) => {
      if (!current) return current;
      const timestamp = Date.now();
      const materialized = materializeActiveTimer(current, timestamp);
      if (!current.isPaused) {
        return { ...materialized, isPaused: true, pausedAt: nowIso(timestamp), lastUpdatedAt: nowIso(timestamp) };
      }
      const pausedAt = new Date(current.pausedAt ?? current.lastUpdatedAt).getTime();
      return {
        ...materialized,
        isPaused: false,
        pausedAt: undefined,
        accumulatedPausedDurationSeconds: current.accumulatedPausedDurationSeconds + Math.max(0, Math.floor((timestamp - pausedAt) / 1000)),
        lastUpdatedAt: nowIso(timestamp),
      };
    });
  }, []);

  const clearTimer = useCallback(() => setActiveTimer(null), []);

  return { activeTimer, snapshot, startBreastfeeding, switchSide, togglePause, clearTimer };
}

export type ActiveTimerController = ReturnType<typeof useActiveTimer>;
