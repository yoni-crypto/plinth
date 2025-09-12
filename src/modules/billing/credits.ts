import { db } from "@/lib/db/client";
import { sql } from "drizzle-orm";

export interface CreditBalance {
  userId: string;
  balance: number;
  plan: string;
  monthlyAllowance: number;
  usedThisMonth: number;
}

export async function getCredits(userId: string): Promise<CreditBalance> {
  // Get user's plan and credits
  const result = await db.execute(sql`
    SELECT 
      u.id as user_id,
      COALESCE(cb.balance, 0) as balance,
      COALESCE(cb.plan, 'free') as plan,
      COALESCE(cb.monthly_allowance, 100) as monthly_allowance,
      COALESCE(cb.used_this_month, 0) as used_this_month
    FROM users u
    LEFT JOIN credit_balances cb ON u.id = cb.user_id
    WHERE u.id = ${userId}
  `);

  if (result.rows.length === 0) {
    return {
      userId,
      balance: 100,
      plan: "free",
      monthlyAllowance: 100,
      usedThisMonth: 0,
    };
  }

  const row = result.rows[0] as any;
  return {
    userId: row.user_id,
    balance: row.balance,
    plan: row.plan,
    monthlyAllowance: row.monthly_allowance,
    usedThisMonth: row.used_this_month,
  };
}

export async function deductCredits(
  userId: string,
  amount: number
): Promise<boolean> {
  const credits = await getCredits(userId);

  if (credits.balance < amount) {
    return false;
  }

  await db.execute(sql`
    UPDATE credit_balances
    SET balance = balance - ${amount},
        used_this_month = used_this_month + ${amount},
        updated_at = NOW()
    WHERE user_id = ${userId}
  `);

  return true;
}

export async function addCredits(
  userId: string,
  amount: number
): Promise<void> {
  await db.execute(sql`
    INSERT INTO credit_balances (user_id, balance, updated_at)
    VALUES (${userId}, ${amount}, NOW())
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      balance = credit_balances.balance + ${amount},
      updated_at = NOW()
  `);
}

export async function resetMonthlyCredits(): Promise<void> {
  // Reset all users' monthly usage
  await db.execute(sql`
    UPDATE credit_balances
    SET used_this_month = 0,
        updated_at = NOW()
  `);
}

export async function setPlan(
  userId: string,
  plan: string,
  monthlyAllowance: number
): Promise<void> {
  await db.execute(sql`
    INSERT INTO credit_balances (user_id, plan, monthly_allowance, updated_at)
    VALUES (${userId}, ${plan}, ${monthlyAllowance}, NOW())
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      plan = ${plan},
      monthly_allowance = ${monthlyAllowance},
      updated_at = NOW()
  `);
}
