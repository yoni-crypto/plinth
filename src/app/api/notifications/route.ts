import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/modules/auth/lib/auth";
import {
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getUnreadCount,
} from "@/modules/notifications";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 }
    );
  }

  const [notifications, unreadCount] = await Promise.all([
    getUserNotifications(user.id),
    getUnreadCount(user.id),
  ]);

  return NextResponse.json({
    success: true,
    data: { notifications, unreadCount },
  });
}

export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 }
    );
  }

  const body = await request.json();

  if (body.markAllRead) {
    await markAllNotificationsRead(user.id);
  } else if (body.notificationId) {
    await markNotificationRead(body.notificationId);
  }

  return NextResponse.json({ success: true, data: null });
}
