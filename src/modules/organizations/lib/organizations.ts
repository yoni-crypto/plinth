import { db } from "@/lib/db/client";
import { organizations, memberships, users, roles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { initializeRoles } from "@/modules/rbac/lib/rbac";
import { slugify } from "@/lib/utils/slugify";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  createdAt: Date;
}

export async function createOrganization(input: {
  name: string;
  userId: string;
}): Promise<Organization> {
  const slug = slugify(input.name);

  const existing = await db.query.organizations.findFirst({
    where: eq(organizations.slug, slug),
  });

  if (existing) {
    throw new Error("An organization with this name already exists");
  }

  const [org] = await db
    .insert(organizations)
    .values({ name: input.name, slug })
    .returning();

  await initializeRoles(org.id);

  const ownerRole = await db.query.roles.findFirst({
    where: eq(roles.name, "Owner"),
  });

  if (ownerRole) {
    await db.insert(memberships).values({
      userId: input.userId,
      organizationId: org.id,
      roleId: ownerRole.id,
    });
  }

  return org;
}

export async function getUserOrganizations(userId: string): Promise<Organization[]> {
  const userMemberships = await db.query.memberships.findMany({
    where: eq(memberships.userId, userId),
  });

  const orgIds = userMemberships.map((m) => m.organizationId);
  if (orgIds.length === 0) return [];

  const orgs: Organization[] = [];
  for (const orgId of orgIds) {
    const org = await db.query.organizations.findFirst({
      where: eq(organizations.id, orgId),
    });
    if (org) orgs.push(org);
  }

  return orgs;
}

export async function getOrganizationMembers(organizationId: string) {
  const members = await db.query.memberships.findMany({
    where: eq(memberships.organizationId, organizationId),
  });

  const result = [];
  for (const member of members) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, member.userId),
    });
    if (user) {
      result.push({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        roleId: member.roleId,
        joinedAt: member.createdAt,
      });
    }
  }

  return result;
}
