import { db } from "@/lib/db/client";
import { plans, subscriptions } from "./schema";
import { getOrganizationSubscription } from "./index";
import { eq, and } from "drizzle-orm";
import type { PlanLimits } from "./schema";

export async function getPlanLimits(organizationId: string): Promise<PlanLimits> {
  const sub = await getOrganizationSubscription(organizationId);
  if (!sub?.plan) {
    return { teamMembers: 1, projects: 3, storage: 1073741824, apiCalls: 1000 };
  }
  return (sub.plan.limits as PlanLimits) || {};
}

export async function checkFeature(
  organizationId: string,
  feature: string
): Promise<boolean> {
  const sub = await getOrganizationSubscription(organizationId);
  if (!sub?.plan) {
    // Free tier
    const freePlan = await db.query.plans.findFirst({
      where: eq(plans.slug, "free"),
    });
    const features = (freePlan?.features as string[]) || [];
    return features.some((f) => f.toLowerCase().includes(feature.toLowerCase()));
  }

  const planFeatures = (sub.plan.features as string[]) || [];
  return planFeatures.some((f) => f.toLowerCase().includes(feature.toLowerCase()));
}

export async function checkLimit(
  organizationId: string,
  resource: string,
  currentUsage: number
): Promise<{ allowed: boolean; limit: number; remaining: number }> {
  const limits = await getPlanLimits(organizationId);
  const limit = limits[resource] ?? 0;

  // -1 means unlimited
  if (limit === -1) {
    return { allowed: true, limit: -1, remaining: -1 };
  }

  return {
    allowed: currentUsage < limit,
    limit,
    remaining: Math.max(0, limit - currentUsage),
  };
}

export async function isSubscriptionActive(organizationId: string): Promise<boolean> {
  const sub = await db.query.subscriptions.findFirst({
    where: and(
      eq(subscriptions.organizationId, organizationId),
      eq(subscriptions.status, "active")
    ),
  });

  if (!sub) return false;

  // Check if expired
  if (sub.currentPeriodEnd && sub.currentPeriodEnd < new Date()) {
    await db
      .update(subscriptions)
      .set({ status: "expired", updatedAt: new Date() })
      .where(eq(subscriptions.id, sub.id));
    return false;
  }

  // Check if canceled but still in period
  if (sub.cancelAt && sub.cancelAt < new Date()) {
    return false;
  }

  return true;
}
