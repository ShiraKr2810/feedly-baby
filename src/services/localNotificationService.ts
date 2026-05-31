import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { FeedingSession, PumpingSession, Reminder } from '../types';

const isNativeApp = () => Capacitor.isNativePlatform();

const notificationIdFor = (reminderId: string) => {
  let hash = 0;
  for (const character of reminderId) {
    hash = (hash * 31 + character.charCodeAt(0)) | 0;
  }
  return Math.max(1, Math.abs(hash));
};

const ensureNotificationPermission = async () => {
  if (!isNativeApp()) return false;
  const current = await LocalNotifications.checkPermissions();
  if (current.display === 'granted') return true;
  const requested = await LocalNotifications.requestPermissions();
  return requested.display === 'granted';
};

const withoutNotificationId = (reminder: Reminder): Reminder => {
  const { notificationId: _notificationId, ...rest } = reminder;
  return rest;
};

export const completedFeedingEndTime = (feeding: FeedingSession) => {
  if (feeding.isIncomplete || feeding.needsReview) return undefined;
  if (feeding.endTime) return feeding.endTime;
  return new Date(new Date(feeding.startTime).getTime() + feeding.totalDurationSeconds * 1000).toISOString();
};

export const latestCompletedFeedingEndTime = (feedings: FeedingSession[]) =>
  feedings
    .map(completedFeedingEndTime)
    .filter((time): time is string => Boolean(time))
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];

export const latestPumpingTime = (pumping: PumpingSession[]) =>
  [...pumping]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())[0]?.time;

export const reminderBaseline = (reminder: Reminder, feedings: FeedingSession[], pumping: PumpingSession[]) =>
  reminder.type === 'feeding' ? latestCompletedFeedingEndTime(feedings) : latestPumpingTime(pumping);

export async function scheduleReminderNotification(reminder: Reminder, baseline?: string): Promise<Reminder> {
  if (!reminder.isActive || !reminder.intervalMinutes) return reminder;
  if (!baseline) {
    await cancelReminderNotification(reminder);
    return withoutNotificationId(reminder);
  }
  if (!isNativeApp()) return reminder;

  try {
    if (!(await ensureNotificationPermission())) return reminder;

    const notificationId = reminder.notificationId ?? notificationIdFor(reminder.id);
    if (reminder.notificationId) {
      await LocalNotifications.cancel({ notifications: [{ id: notificationId }] });
    }

    const requestedTime = new Date(baseline).getTime() + reminder.intervalMinutes * 60_000;
    const at = new Date(Math.max(requestedTime, Date.now() + 60_000));

    // Every relevant saved session reschedules this notification. Arbitrary-minute
    // background repeats can be added later without changing the reminder model.
    await LocalNotifications.schedule({
      notifications: [
        {
          id: notificationId,
          title: reminder.title,
          body: reminder.type === 'feeding' ? 'הגיע הזמן לבדוק אם הגיע זמן להנקה.' : 'הגיע הזמן לשאיבה.',
          schedule: {
            at,
            allowWhileIdle: true,
          },
          extra: { reminderId: reminder.id, reminderType: reminder.type },
        },
      ],
    });

    return { ...reminder, notificationId };
  } catch {
    return reminder;
  }
}

export async function cancelReminderNotification(reminder: Reminder) {
  if (!isNativeApp() || !reminder.notificationId) return;
  try {
    await LocalNotifications.cancel({ notifications: [{ id: reminder.notificationId }] });
  } catch {
    // A missing or already delivered notification should not break the app.
  }
}

export async function cancelReminderNotifications(reminders: Reminder[]) {
  await Promise.all(reminders.map(cancelReminderNotification));
}

export async function rescheduleActiveReminderNotifications(
  reminders: Reminder[],
  feedings: FeedingSession[],
  pumping: PumpingSession[],
) {
  return Promise.all(
    reminders.map((reminder) =>
      reminder.isActive
        ? scheduleReminderNotification(reminder, reminderBaseline(reminder, feedings, pumping))
        : Promise.resolve(reminder),
    ),
  );
}
