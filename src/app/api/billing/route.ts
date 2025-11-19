import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/modules/auth/lib/auth";
import {
  getPlans,
  getOrganizationSubscription,
  getOrganizationInvoices,
} from "@/modules/billing";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const orgId = searchParams.get("organizationId");
  const action = searchParams.get("action");

  if (action === "plans") {
    const plans = await getPlans();
    return NextResponse.json({ success: true, data: { plans } });
  }

  if (action === "subscription" && orgId) {
    const subscription = await getOrganizationSubscription(orgId);
    return NextResponse.json({ success: true, data: { subscription } });
  }

  if (action === "invoices" && orgId) {
    const invoices = await getOrganizationInvoices(orgId);
    return NextResponse.json({ success: true, data: { invoices } });
  }

  return NextResponse.json(
    { success: false, error: { code: "VALIDATION_ERROR", message: "action parameter is required" } },
    { status: 400 }
  );
}
