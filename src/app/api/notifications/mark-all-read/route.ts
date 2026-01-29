import { db } from "@/db";
import { notifications } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq, isNull } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db
      .update(notifications)
      .set({ readAt: new Date() })
      .where(
        and(
          eq(notifications.userId, session.user.id),
          eq(notifications.channel, "in_app"),
          isNull(notifications.readAt)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
    return NextResponse.json(
      { error: "Failed to mark all notifications as read" },
      { status: 500 }
    );
  }
}
