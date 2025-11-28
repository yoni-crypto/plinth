import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin, getAdminUsers, toggleSuperAdmin, deleteUser } from "@/modules/admin";
import { logAudit } from "@/modules/audit";

export async function GET(request: NextRequest) {
  try {
    await requireSuperAdmin();
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: error instanceof Error ? error.message : "Forbidden" } },
      { status: 403 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);

  const result = await getAdminUsers({ page, pageSize });
  return NextResponse.json({ success: true, data: result });
}

export async function PATCH(request: NextRequest) {
  let admin;
  try {
    admin = await requireSuperAdmin();
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: error instanceof Error ? error.message : "Forbidden" } },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { userId, isSuperAdmin } = body;

  if (!userId || typeof isSuperAdmin !== "boolean") {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "userId and isSuperAdmin are required" } },
      { status: 400 }
    );
  }

  await toggleSuperAdmin(userId, isSuperAdmin);

  await logAudit({
    userId: admin.id,
    action: isSuperAdmin ? "grant_admin" : "revoke_admin",
    resource: "user",
    resourceId: userId,
    description: `${isSuperAdmin ? "Granted" : "Revoked"} super admin for user ${userId}`,
  });

  return NextResponse.json({ success: true, data: null });
}

export async function DELETE(request: NextRequest) {
  let admin;
  try {
    admin = await requireSuperAdmin();
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: error instanceof Error ? error.message : "Forbidden" } },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { userId } = body;

  if (!userId) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "userId is required" } },
      { status: 400 }
    );
  }

  await deleteUser(userId);

  await logAudit({
    userId: admin.id,
    action: "delete",
    resource: "user",
    resourceId: userId,
    description: `Deleted user ${userId}`,
  });

  return NextResponse.json({ success: true, data: null });
}
