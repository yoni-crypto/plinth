import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/modules/auth/lib/auth";
import { createApiKey, getUserApiKeys, revokeApiKey } from "@/modules/api-keys";
import { logAudit } from "@/modules/audit";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 }
    );
  }

  const keys = await getUserApiKeys(user.id);
  return NextResponse.json({ success: true, data: { apiKeys: keys } });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { name, scopes, expiresInDays } = body;

  if (!name) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "Name is required" } },
      { status: 400 }
    );
  }

  const result = await createApiKey({
    userId: user.id,
    name,
    scopes,
    expiresInDays,
  });

  await logAudit({
    userId: user.id,
    action: "create",
    resource: "api_key",
    resourceId: result.id,
    description: `Created API key "${name}"`,
  });

  return NextResponse.json({
    success: true,
    data: { apiKey: result },
  });
}

export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "API key ID is required" } },
      { status: 400 }
    );
  }

  await revokeApiKey(id);

  await logAudit({
    userId: user.id,
    action: "revoke",
    resource: "api_key",
    resourceId: id,
    description: "Revoked API key",
  });

  return NextResponse.json({ success: true, data: null });
}
