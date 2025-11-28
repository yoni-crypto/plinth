import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin, getAdminOrganizations, deleteOrganization } from "@/modules/admin";
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

  const result = await getAdminOrganizations({ page, pageSize });
  return NextResponse.json({ success: true, data: result });
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
  const { organizationId } = body;

  if (!organizationId) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "organizationId is required" } },
      { status: 400 }
    );
  }

  await deleteOrganization(organizationId);

  await logAudit({
    userId: admin.id,
    action: "delete",
    resource: "organization",
    resourceId: organizationId,
    description: `Deleted organization ${organizationId}`,
  });

  return NextResponse.json({ success: true, data: null });
}
