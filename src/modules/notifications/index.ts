import { db } from "@/lib/db/client";
import { notifications } from "./schema";
import { eq, and, desc } from "drizzle-orm";

export async function createNotification(input: {
  userId: string;
  title: string;
  message?: string;
  type?: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}) {
  const [notification] = await db
    .insert(notifications)
    .values({
      userId: input.userId,
      title: input.title,
      message: input.message,
      type: input.type || "info",
      actionUrl: input.actionUrl,
      metadata: input.metadata,
    })
    .returning();

  return notification;
}

export async function getUserNotifications(userId: string, options?: { unreadOnly?: boolean }) {
  const conditions = [eq(notifications.userId, userId)];
  if (options?.unreadOnly) {
    conditions.push(eq(notifications.read, false));
  }

  return db.query.notifications.findMany({
    where: and(...conditions),
    orderBy: desc(notifications.createdAt),
    limit: 50,
  });
}

export async function markNotificationRead(id: string) {
  await db.update(notifications).set({ read: true }).where(eq(notifications.id, id));
}

export async function markAllNotificationsRead(userId: string) {
  await db
    .update(notifications)
    .set({ read: true })
    .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));
}

export async function getUnreadCount(userId: string) {
  const result = await db.query.notifications.findMany({
    where: and(eq(notifications.userId, userId), eq(notifications.read, false)),
    columns: { id: true },
  });
  return result.length;
}
