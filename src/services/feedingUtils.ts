import { FeedingSession } from '../types';
import { isSameDay } from './dateUtils';

export const sideLabel = (side: 'right' | 'left' | 'both') =>
  side === 'right' ? 'ימין' : side === 'left' ? 'שמאל' : 'שני הצדדים';

export const latestCompletedFeeding = (feedings: FeedingSession[]) =>
  [...feedings]
    .filter((feeding) => !feeding.isIncomplete && !feeding.needsReview)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())[0];

export const recommendedSide = (feedings: FeedingSession[]) => {
  const latest = latestCompletedFeeding(feedings);
  if (!latest) return 'right';
  if (latest.startSide === 'right') return 'left';
  if (latest.startSide === 'left') return 'right';
  const today = feedings.filter((feeding) => isSameDay(feeding.startTime));
  const right = today.reduce((sum, feeding) => sum + feeding.rightDurationSeconds, 0);
  const left = today.reduce((sum, feeding) => sum + feeding.leftDurationSeconds, 0);
  return right <= left ? 'right' : 'left';
};

export const totalSideDurations = (feedings: FeedingSession[]) =>
  feedings.reduce(
    (acc, feeding) => ({
      right: acc.right + feeding.rightDurationSeconds,
      left: acc.left + feeding.leftDurationSeconds,
    }),
    { right: 0, left: 0 },
  );
