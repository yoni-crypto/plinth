import { config } from "dotenv";
import path from "path";
config({ path: path.resolve(process.cwd(), ".env") });

import pg from "pg";

async function main() {
  console.log("Seeding database...");

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

  // Dynamic imports after env is loaded
  const { db } = await import("../src/lib/db/client");
  const { users, organizations, memberships, roles, permissions, rolePermissions } = await import("../src/lib/db/schema");
  const { hashPassword } = await import("../src/modules/auth/lib/password");

  // Seed data
  const passwordHash = await hashPassword("password123");

  const [admin] = await db
    .insert(users)
    .values({
      email: "admin@plinth.dev",
      name: "Admin User",
      passwordHash,
      isSuperAdmin: true,
      emailVerified: new Date(),
    })
    .onConflictDoNothing()
    .returning();

  const [member] = await db
    .insert(users)
    .values({
      email: "member@plinth.dev",
      name: "Team Member",
      passwordHash,
      emailVerified: new Date(),
    })
    .onConflictDoNothing()
    .returning();

  if (admin) {
    const [org] = await db
      .insert(organizations)
      .values({
        name: "Acme Inc",
        slug: "acme-inc",
      })
      .onConflictDoNothing()
      .returning();

    if (org) {
      const [ownerRole] = await db
        .insert(roles)
        .values({ name: "Owner", isSystem: true, organizationId: org.id })
        .onConflictDoNothing()
        .returning();

      const [adminRole] = await db
        .insert(roles)
        .values({ name: "Admin", isSystem: true, organizationId: org.id })
        .onConflictDoNothing()
        .returning();

      const [memberRole] = await db
        .insert(roles)
        .values({ name: "Member", isSystem: true, organizationId: org.id })
        .onConflictDoNothing()
        .returning();

      const permDefs = [
        { action: "read", resource: "members" },
        { action: "invite", resource: "members" },
        { action: "remove", resource: "members" },
        { action: "read", resource: "roles" },
        { action: "read", resource: "settings" },
        { action: "update", resource: "settings" },
        { action: "read", resource: "billing" },
      ];

      const permIds: string[] = [];
      for (const p of permDefs) {
        const [perm] = await db
          .insert(permissions)
          .values(p)
          .onConflictDoNothing()
          .returning();
        if (perm) permIds.push(perm.id);
      }

      if (adminRole) {
        for (const permId of permIds) {
          await db.insert(rolePermissions).values({
            roleId: adminRole.id,
            permissionId: permId,
          }).onConflictDoNothing();
        }
      }

      if (ownerRole) {
        await db.insert(memberships).values({
          userId: admin.id,
          organizationId: org.id,
          roleId: ownerRole.id,
        }).onConflictDoNothing();
      }

      if (memberRole && member) {
        await db.insert(memberships).values({
          userId: member.id,
          organizationId: org.id,
          roleId: memberRole.id,
        }).onConflictDoNothing();
      }
    }
  }

  await pool.end();

  console.log("Seed complete!");
  console.log("  Admin: admin@plinth.dev / password123");
  console.log("  Member: member@plinth.dev / password123");
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
