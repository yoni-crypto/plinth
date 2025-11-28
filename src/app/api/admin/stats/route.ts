import { NextResponse } from "next/server";
import { getAdminStats } from "@/modules/admin";

export async function GET() {
  try {
    const stats = await getAdminStats();
    return NextResponse.json({ success: true, data: stats });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to fetch stats" } },
      { status: 500 }
    );
  }
}
