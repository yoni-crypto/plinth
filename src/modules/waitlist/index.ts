import { db } from "@/lib/db/client";
import { sql } from "drizzle-orm";

export interface WaitlistEntry {
  id: string;
  email: string;
  name?: string;
  referredBy?: string;
  position: number;
  status: "pending" | "invited" | "joined";
  createdAt: Date;
}

export async function joinWaitlist(
  email: string,
  name?: string,
  referredBy?: string
): Promise<WaitlistEntry> {
  const maxPosResult = await db.execute(sql`
    SELECT COALESCE(MAX(position), 0) + 1 as next_pos
    FROM waitlist
  `);
  const nextPos = (maxPosResult.rows[0] as any).next_pos;

  const result = await db.execute(sql`
    INSERT INTO waitlist (email, name, referred_by, position, status, created_at)
    VALUES (${email}, ${name || null}, ${referredBy || null}, ${nextPos}, 'pending', NOW())
    RETURNING *
  `);

  const row = result.rows[0] as any;
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    referredBy: row.referred_by,
    position: row.position,
    status: row.status,
    createdAt: new Date(row.created_at),
  };
}

export async function getWaitlistPosition(
  email: string
): Promise<number | null> {
  const result = await db.execute(sql`
    SELECT position
    FROM waitlist
    WHERE email = ${email}
  `);

  if (result.rows.length === 0) {
    return null;
  }

  return (result.rows[0] as any).position;
}

export async function getWaitlistCount(): Promise<number> {
  const result = await db.execute(sql`
    SELECT COUNT(*) as count
    FROM waitlist
  `);

  return parseInt((result.rows[0] as any).count);
}

export async function inviteUser(email: string): Promise<void> {
  await db.execute(sql`
    UPDATE waitlist
    SET status = 'invited',
        updated_at = NOW()
    WHERE email = ${email}
  `);
}

export async function joinFromWaitlist(
  email: string,
  userId: string
): Promise<void> {
  await db.execute(sql`
    UPDATE waitlist
    SET status = 'joined',
        user_id = ${userId},
        updated_at = NOW()
    WHERE email = ${email}
  `);
}
