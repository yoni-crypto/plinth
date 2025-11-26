import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import pg from "pg";

export async function GET() {
  const checks: Record<string, { status: string; latencyMs?: number }> = {};
  let healthy = true;

  // Database check
  const dbStart = Date.now();
  try {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    await pool.query("SELECT 1");
    await pool.end();
    checks.database = { status: "ok", latencyMs: Date.now() - dbStart };
  } catch (error) {
    checks.database = { status: "error", latencyMs: Date.now() - dbStart };
    healthy = false;
  }

  return NextResponse.json(
    {
      status: healthy ? "healthy" : "degraded",
      version: process.env.npm_package_version || "0.1.0",
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: healthy ? 200 : 503 }
  );
}
