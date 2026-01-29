import { db } from "@/db";
import { notifications } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, desc, eq, isNull } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userNotifications = await db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, session.user.id),
          eq(notifications.channel, "in_app")
        )
      )
      .orderBy(desc(notifications.createdAt))
      .limit(50);

    const unreadCount = await db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, session.user.id),
          eq(notifications.channel, "in_app"),
          isNull(notifications.readAt)
        )
      );

    return NextResponse.json({
      notifications: userNotifications,
      unreadCount: unreadCount.length,
    });
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
