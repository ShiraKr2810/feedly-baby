import { ActiveTimer, FeedingSession } from '../types';
import { uid } from './storageService';

export function activeTimerToFeedingSession(timer: ActiveTimer, quick = false, note?: string): FeedingSession {
  const rightDurationSeconds = timer.rightDurationSeconds;
  const leftDurationSeconds = timer.leftDurationSeconds;
  return {
    id: uid(),
    babyId: timer.babyId,
    startTime: timer.startTime,
    endTime: quick ? undefined : new Date().toISOString(),
    startSide: timer.startSide ?? 'right',
    rightDurationSeconds,
    leftDurationSeconds,
    totalDurationSeconds: rightDurationSeconds + leftDurationSeconds,
    note: note?.trim() || undefined,
    isIncomplete: quick,
    needsReview: quick,
    createdAt: new Date().toISOString(),
  };
}
