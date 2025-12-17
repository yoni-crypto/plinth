import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/modules/auth/lib/auth";
import {
  createWebhook,
  getOrganizationWebhooks,
  deleteWebhook,
} from "@/modules/webhooks";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 }
    );
  }

  const orgId = request.nextUrl.searchParams.get("organizationId");
  if (!orgId) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "organizationId is required" } },
      { status: 400 }
    );
  }

  const hooks = await getOrganizationWebhooks(orgId);
  return NextResponse.json({ success: true, data: { webhooks: hooks } });
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
  const { organizationId, url, events } = body;

  if (!organizationId || !url) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "organizationId and url are required" } },
      { status: 400 }
    );
  }

  const webhook = await createWebhook({ organizationId, url, events });

  return NextResponse.json({ success: true, data: { webhook } });
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
      { success: false, error: { code: "VALIDATION_ERROR", message: "Webhook ID is required" } },
      { status: 400 }
    );
  }

  await deleteWebhook(id);
  return NextResponse.json({ success: true, data: null });
}
