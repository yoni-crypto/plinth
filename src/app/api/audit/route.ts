import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/modules/auth/lib/auth";
import { getAuditLogs } from "@/modules/audit";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);
  const action = searchParams.get("action") || undefined;

  const result = await getAuditLogs({
    userId: user.id,
    page,
    pageSize,
    action,
  });

  return NextResponse.json({ success: true, data: result });
}
