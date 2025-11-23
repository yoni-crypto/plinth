import { db } from "@/lib/db/client";
import { featureFlags, featureFlagOverrides } from "./schema";
import { eq, and } from "drizzle-orm";

export async function isFeatureEnabled(
  flagName: string,
  context?: { userId?: string; organizationId?: string }
): Promise<boolean> {
  const flag = await db.query.featureFlags.findFirst({
    where: eq(featureFlags.name, flagName),
  });

  if (!flag) return false;

  // Check for user-specific override
  if (context?.userId) {
    const userOverride = await db.query.featureFlagOverrides.findFirst({
      where: and(
        eq(featureFlagOverrides.flagId, flag.id),
        eq(featureFlagOverrides.userId, context.userId)
      ),
    });
    if (userOverride) return userOverride.enabled;
  }

  // Check for organization-specific override
  if (context?.organizationId) {
    const orgOverride = await db.query.featureFlagOverrides.findFirst({
      where: and(
        eq(featureFlagOverrides.flagId, flag.id),
        eq(featureFlagOverrides.organizationId, context.organizationId)
      ),
    });
    if (orgOverride) return orgOverride.enabled;
  }

  return flag.enabled;
}

export async function getFeatureFlags() {
  return db.query.featureFlags.findMany();
}

export async function createFeatureFlag(input: {
  name: string;
  description?: string;
  enabled?: boolean;
}) {
  const [flag] = await db
    .insert(featureFlags)
    .values({
      name: input.name,
      description: input.description,
      enabled: input.enabled ?? false,
    })
    .returning();

  return flag;
}

export async function updateFeatureFlag(
  name: string,
  input: { enabled?: boolean; description?: string }
) {
  await db
    .update(featureFlags)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(featureFlags.name, name));
}

export async function setFeatureFlagOverride(input: {
  flagId: string;
  userId?: string;
  organizationId?: string;
  enabled: boolean;
}) {
  // Try to find existing override
  const conditions = [eq(featureFlagOverrides.flagId, input.flagId)];
  if (input.userId) conditions.push(eq(featureFlagOverrides.userId, input.userId));
  if (input.organizationId) conditions.push(eq(featureFlagOverrides.organizationId, input.organizationId));

  const existing = await db.query.featureFlagOverrides.findFirst({
    where: and(...conditions),
  });

  if (existing) {
    await db
      .update(featureFlagOverrides)
      .set({ enabled: input.enabled })
      .where(eq(featureFlagOverrides.id, existing.id));
  } else {
    await db.insert(featureFlagOverrides).values(input);
  }
}
