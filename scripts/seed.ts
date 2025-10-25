import { config } from "dotenv";
import path from "path";

config({ path: path.resolve(process.cwd(), ".env.local") });

import { db } from "../lib/db/client";
import { users, organizations, memberships, roles, permissions, rolePermissions } from "../lib/db/schema";
import { hashPassword } from "../modules/auth/lib/password";
import { eq } from "drizzle-orm";
import pg from "pg";

async function main() {
  console.log("Seeding database...");

  // Create tables if they don't exist
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) NOT NULL UNIQUE,
      email_verified TIMESTAMP,
      name VARCHAR(100),
      password_hash TEXT,
      avatar TEXT,
      is_super_admin BOOLEAN NOT NULL DEFAULT FALSE,
      preferences JSONB DEFAULT '{}',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      ip_address VARCHAR(45),
      user_agent TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS organizations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) NOT NULL UNIQUE,
      logo TEXT,
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS roles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(50) NOT NULL,
      description TEXT,
      is_system BOOLEAN NOT NULL DEFAULT FALSE,
      organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS permissions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      action VARCHAR(100) NOT NULL,
      resource VARCHAR(100) NOT NULL,
      description TEXT,
      UNIQUE(action, resource)
    );

    CREATE TABLE IF NOT EXISTS role_permissions (
      role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
      permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
      PRIMARY KEY(role_id, permission_id)
    );

    CREATE TABLE IF NOT EXISTS memberships (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      role_id UUID NOT NULL REFERENCES roles(id),
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      UNIQUE(user_id, organization_id)
    );
  `);

  await pool.end();

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
    // Create organization
    const [org] = await db
      .insert(organizations)
      .values({
        name: "Acme Inc",
        slug: "acme-inc",
      })
      .onConflictDoNothing()
      .returning();

    if (org) {
      // Create roles
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

      // Create permissions
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

      // Assign all permissions to admin role
      if (adminRole) {
        for (const permId of permIds) {
          await db.insert(rolePermissions).values({
            roleId: adminRole.id,
            permissionId: permId,
          }).onConflictDoNothing();
        }
      }

      // Add members
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

  console.log("Seed complete!");
  console.log("  Admin: admin@plinth.dev / password123");
  console.log("  Member: member@plinth.dev / password123");
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
