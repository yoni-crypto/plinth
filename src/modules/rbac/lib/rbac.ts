import { db } from "@/lib/db/client";
import { roles, permissions, rolePermissions, memberships, organizations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export type Permission = {
  action: string;
  resource: string;
};

const SYSTEM_ROLES = {
  owner: {
    name: "Owner",
    description: "Full access to the organization",
    permissions: ["*"],
  },
  admin: {
    name: "Admin",
    description: "Administrative access",
    permissions: [
      "members.read",
      "members.invite",
      "members.remove",
      "roles.read",
      "settings.read",
      "settings.update",
      "billing.read",
    ],
  },
  member: {
    name: "Member",
    description: "Basic member access",
    permissions: ["members.read", "settings.read"],
  },
  viewer: {
    name: "Viewer",
    description: "Read-only access",
    permissions: [],
  },
} as const;

export async function initializeRoles(organizationId: string) {
  for (const [, role] of Object.entries(SYSTEM_ROLES)) {
    const [created] = await db
      .insert(roles)
      .values({
        name: role.name,
        description: role.description,
        isSystem: true,
        organizationId,
      })
      .returning();

    if (role.permissions[0] !== "*") {
      for (const perm of role.permissions) {
        const [action, resource] = perm.split(".");
        const [permission] = await db
          .insert(permissions)
          .values({ action, resource })
          .onConflictDoNothing()
          .returning();

        if (permission) {
          await db.insert(rolePermissions).values({
            roleId: created.id,
            permissionId: permission.id,
          });
        }
      }
    }
  }
}

export async function getUserPermissions(
  userId: string,
  organizationId: string
): Promise<Permission[]> {
  const membership = await db.query.memberships.findFirst({
    where: and(
      eq(memberships.userId, userId),
      eq(memberships.organizationId, organizationId)
    ),
  });

  if (!membership) return [];

  const role = await db.query.roles.findFirst({
    where: eq(roles.id, membership.roleId),
  });

  if (!role) return [];

  if (role.name === "Owner") {
    return [{ action: "*", resource: "*" }];
  }

  const rolePerms = await db.query.rolePermissions.findMany({
    where: eq(rolePermissions.roleId, role.id),
  });

  const perms: Permission[] = [];
  for (const rp of rolePerms) {
    const perm = await db.query.permissions.findFirst({
      where: eq(permissions.id, rp.permissionId),
    });
    if (perm) {
      perms.push({ action: perm.action, resource: perm.resource });
    }
  }

  return perms;
}

export function can(
  permissions: Permission[],
  action: string,
  resource: string
): boolean {
  if (permissions.some((p) => p.action === "*" && p.resource === "*")) {
    return true;
  }

  return permissions.some(
    (p) =>
      (p.action === action || p.action === "*") &&
      (p.resource === resource || p.resource === "*")
  );
}

export async function getUserOrganizations(userId: string) {
  const userMemberships = await db.query.memberships.findMany({
    where: eq(memberships.userId, userId),
  });

  const orgIds = userMemberships.map((m) => m.organizationId);
  if (orgIds.length === 0) return [];

  const orgs = [];
  for (const orgId of orgIds) {
    const org = await db.query.organizations.findFirst({
      where: eq(organizations.id, orgId),
    });
    if (org) orgs.push(org);
  }

  return orgs;
}
