import { db } from "@/lib/db/client";
import { plans, subscriptions, invoices } from "./schema";
import { eq, and, desc } from "drizzle-orm";

export const DEFAULT_PLANS = [
  {
    name: "Free",
    slug: "free",
    description: "For individuals getting started",
    price: 0,
    currency: "USD",
    interval: "month",
    features: ["1 user", "3 projects", "1GB storage"],
    limits: { teamMembers: 1, projects: 3, storage: 1073741824, apiCalls: 1000 },
  },
  {
    name: "Pro",
    slug: "pro",
    description: "For teams building products",
    price: 2900,
    currency: "USD",
    interval: "month",
    features: ["10 users", "Unlimited projects", "50GB storage", "Priority support"],
    limits: { teamMembers: 10, projects: -1, storage: 53687091200, apiCalls: 100000 },
  },
  {
    name: "Business",
    slug: "business",
    description: "For organizations at scale",
    price: 9900,
    currency: "USD",
    interval: "month",
    features: ["Unlimited users", "Unlimited projects", "500GB storage", "Dedicated support", "Custom integrations"],
    limits: { teamMembers: -1, projects: -1, storage: 536870912000, apiCalls: 1000000 },
  },
];

export async function initializePlans() {
  for (const plan of DEFAULT_PLANS) {
    await db
      .insert(plans)
      .values(plan)
      .onConflictDoNothing({ target: plans.slug });
  }
}

export async function getPlans() {
  return db.query.plans.findMany({
    where: eq(plans.active, "active"),
    orderBy: (plans, { asc }) => asc(plans.price),
  });
}

export async function getPlanBySlug(slug: string) {
  return db.query.plans.findFirst({
    where: eq(plans.slug, slug),
  });
}

export async function getOrganizationSubscription(organizationId: string) {
  const sub = await db.query.subscriptions.findFirst({
    where: and(
      eq(subscriptions.organizationId, organizationId),
      eq(subscriptions.status, "active")
    ),
    orderBy: desc(subscriptions.createdAt),
  });

  if (!sub) return null;

  const plan = await db.query.plans.findFirst({
    where: eq(plans.id, sub.planId),
  });

  return { ...sub, plan };
}

export async function createSubscription(input: {
  organizationId: string;
  planId: string;
  externalId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
}) {
  const [sub] = await db
    .insert(subscriptions)
    .values({
      organizationId: input.organizationId,
      planId: input.planId,
      externalId: input.externalId,
      currentPeriodStart: input.currentPeriodStart || new Date(),
      currentPeriodEnd: input.currentPeriodEnd || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    })
    .returning();

  return sub;
}

export async function cancelSubscription(organizationId: string) {
  const sub = await db.query.subscriptions.findFirst({
    where: and(
      eq(subscriptions.organizationId, organizationId),
      eq(subscriptions.status, "active")
    ),
  });

  if (sub) {
    await db
      .update(subscriptions)
      .set({ status: "canceled", cancelAt: new Date(), updatedAt: new Date() })
      .where(eq(subscriptions.id, sub.id));
  }
}

export async function createInvoice(input: {
  organizationId: string;
  subscriptionId?: string;
  amount: number;
  currency?: string;
  externalId?: string;
}) {
  const [invoice] = await db
    .insert(invoices)
    .values({
      organizationId: input.organizationId,
      subscriptionId: input.subscriptionId,
      amount: input.amount,
      currency: input.currency || "USD",
      externalId: input.externalId,
    })
    .returning();

  return invoice;
}

export async function getOrganizationInvoices(organizationId: string) {
  return db.query.invoices.findMany({
    where: eq(invoices.organizationId, organizationId),
    orderBy: desc(invoices.createdAt),
  });
}
