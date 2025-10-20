import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/modules/auth/lib/auth";
import { createOrganization } from "@/modules/organizations/lib/organizations";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Organization name is required" } },
        { status: 400 }
      );
    }

    const org = await createOrganization({ name, userId: user.id });

    return NextResponse.json({ success: true, data: { organization: org } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create organization";
    return NextResponse.json(
      { success: false, error: { code: "BAD_REQUEST", message } },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
        { status: 401 }
      );
    }

    const { getUserOrganizations } = await import("@/modules/organizations/lib/organizations");
    const orgs = await getUserOrganizations(user.id);

    return NextResponse.json({ success: true, data: { organizations: orgs } });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to fetch organizations" } },
      { status: 500 }
    );
  }
}
