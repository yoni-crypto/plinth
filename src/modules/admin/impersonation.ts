import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { sql } from "drizzle-orm";

export async function impersonateUser(
  adminId: string,
  targetUserId: string
): Promise<{ sessionToken: string; expiresAt: Date }> {
  // Verify admin is super admin
  const adminResult = await db.execute(sql`
    SELECT is_super_admin
    FROM users
    WHERE id = ${adminId}
  `);

  const admin = adminResult.rows[0] as any;
  if (!admin?.is_super_admin) {
    throw new Error("Only super admins can impersonate users");
  }

  // Prevent impersonating other admins
  const targetResult = await db.execute(sql`
    SELECT is_super_admin
    FROM users
    WHERE id = ${targetUserId}
  `);

  const target = targetResult.rows[0] as any;
  if (target?.is_super_admin) {
    throw new Error("Cannot impersonate other super admins");
  }

  // Create impersonation session
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour max

  const sessionResult = await db.execute(sql`
    INSERT INTO sessions (
      user_id, 
      token, 
      expires_at,
      impersonated_by,
      created_at,
      updated_at
    )
    VALUES (
      ${targetUserId},
      ${generateToken()},
      ${expiresAt.toISOString()},
      ${adminId},
      NOW(),
      NOW()
    )
    RETURNING token, expires_at
  `);

  const session = sessionResult.rows[0] as any;

  // Log the impersonation
  await db.execute(sql`
    INSERT INTO audit_logs (
      user_id,
      action,
      resource_type,
      resource_id,
      metadata,
      created_at
    )
    VALUES (
      ${adminId},
      'impersonate',
      'user',
      ${targetUserId},
      ${JSON.stringify({ expiresAt: expiresAt.toISOString() })},
      NOW()
    )
  `);

  return {
    sessionToken: session.token,
    expiresAt: new Date(session.expires_at),
  };
}

export async function stopImpersonation(
  sessionToken: string
): Promise<void> {
  await db.execute(sql`
    DELETE FROM sessions
    WHERE token = ${sessionToken}
    AND impersonated_by IS NOT NULL
  `);
}

function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}
