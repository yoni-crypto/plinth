import { db } from "@/lib/db/client";
import { users, organizations, memberships } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { getCurrentUser } from "@/modules/auth/lib/auth";

export async function requireSuperAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  if (!user.isSuperAdmin) {
    throw new Error("Super admin access required");
  }
  return user;
}

export async function getAdminStats() {
  const [userCount] = await db.select({ count: users.id }).from(users);
  const [orgCount] = await db.select({ count: organizations.id }).from(organizations);
  const [memberCount] = await db.select({ count: memberships.id }).from(memberships);

  return {
    users: Number(userCount?.count || 0),
    organizations: Number(orgCount?.count || 0),
    memberships: Number(memberCount?.count || 0),
  };
}

export async function getAdminUsers(options?: { page?: number; pageSize?: number }) {
  const page = options?.page || 1;
  const pageSize = options?.pageSize || 20;
  const offset = (page - 1) * pageSize;

  const allUsers = await db.query.users.findMany({
    orderBy: desc(users.createdAt),
    limit: pageSize,
    offset,
    columns: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      isSuperAdmin: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const [total] = await db.select({ count: users.id }).from(users);

  return {
    data: allUsers,
    pagination: {
      page,
      pageSize,
      total: Number(total?.count || 0),
      totalPages: Math.ceil(Number(total?.count || 0) / pageSize),
    },
  };
}

export async function getAdminOrganizations(options?: { page?: number; pageSize?: number }) {
  const page = options?.page || 1;
  const pageSize = options?.pageSize || 20;
  const offset = (page - 1) * pageSize;

  const orgs = await db.query.organizations.findMany({
    orderBy: desc(organizations.createdAt),
    limit: pageSize,
    offset,
  });

  const [total] = await db.select({ count: organizations.id }).from(organizations);

  return {
    data: orgs,
    pagination: {
      page,
      pageSize,
      total: Number(total?.count || 0),
      totalPages: Math.ceil(Number(total?.count || 0) / pageSize),
    },
  };
}

export async function toggleSuperAdmin(userId: string, isSuperAdmin: boolean) {
  await db
    .update(users)
    .set({ isSuperAdmin, updatedAt: new Date() })
    .where(eq(users.id, userId));
}

export async function deleteUser(userId: string) {
  await db.delete(users).where(eq(users.id, userId));
}

export async function deleteOrganization(orgId: string) {
  await db.delete(organizations).where(eq(organizations.id, orgId));
}
