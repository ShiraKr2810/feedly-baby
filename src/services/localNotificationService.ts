import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Reminder } from '../types';

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

export async function scheduleReminderNotification(reminder: Reminder): Promise<Reminder> {
  if (!isNativeApp() || !reminder.isActive || !reminder.intervalMinutes) return reminder;

  try {
    if (!(await ensureNotificationPermission())) return reminder;

    const notificationId = reminder.notificationId ?? notificationIdFor(reminder.id);
    if (reminder.notificationId) {
      await LocalNotifications.cancel({ notifications: [{ id: notificationId }] });
    }

    // Android schedules the first arbitrary-minute reminder reliably. Repeating
    // intervals can be added later with a background rescheduler after delivery.
    await LocalNotifications.schedule({
      notifications: [
        {
          id: notificationId,
          title: reminder.title,
          body: reminder.type === 'feeding' ? 'הגיע הזמן לבדוק אם הגיע זמן להנקה.' : 'הגיע הזמן לשאיבה.',
          schedule: {
            at: new Date(Date.now() + reminder.intervalMinutes * 60_000),
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
