import { NextResponse } from "next/server";
import { logout } from "@/modules/auth/lib/auth";

export async function POST() {
  try {
    await logout();
    return NextResponse.json({ success: true, data: null });
  } catch {
    return NextResponse.json({ success: true, data: null });
  }
}
