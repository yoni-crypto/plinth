import crypto from "crypto";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db/client";
import { apiKeys } from "./schema";
import { eq, and, isNull } from "drizzle-orm";

function generateApiKey(): { raw: string; prefix: string; hash: string } {
  const raw = `plinth_${crypto.randomBytes(32).toString("hex")}`;
  const prefix = raw.slice(0, 12);
  const hash = bcrypt.hashSync(raw, 10);
  return { raw, prefix, hash };
}

export async function createApiKey(input: {
  userId: string;
  organizationId?: string;
  name: string;
  scopes?: string[];
  expiresInDays?: number;
}) {
  const { raw, prefix, hash } = generateApiKey();

  const expiresAt = input.expiresInDays
    ? new Date(Date.now() + input.expiresInDays * 24 * 60 * 60 * 1000)
    : null;

  const [apiKey] = await db
    .insert(apiKeys)
    .values({
      userId: input.userId,
      organizationId: input.organizationId,
      name: input.name,
      keyPrefix: prefix,
      keyHash: hash,
      scopes: input.scopes || [],
      expiresAt,
    })
    .returning();

  return { ...apiKey, rawKey: raw };
}

export async function revokeApiKey(id: string) {
  await db
    .update(apiKeys)
    .set({ revokedAt: new Date() })
    .where(eq(apiKeys.id, id));
}

export async function getUserApiKeys(userId: string) {
  return db.query.apiKeys.findMany({
    where: eq(apiKeys.userId, userId),
    orderBy: (keys, { desc }) => desc(keys.createdAt),
  });
}

export async function validateApiKey(rawKey: string) {
  const prefix = rawKey.slice(0, 12);

  const keyRecord = await db.query.apiKeys.findFirst({
    where: and(
      eq(apiKeys.keyPrefix, prefix),
      isNull(apiKeys.revokedAt)
    ),
  });

  if (!keyRecord) return null;

  if (keyRecord.expiresAt && keyRecord.expiresAt < new Date()) {
    return null;
  }

  const valid = bcrypt.compareSync(rawKey, keyRecord.keyHash);
  if (!valid) return null;

  await db
    .update(apiKeys)
    .set({ lastUsedAt: new Date() })
    .where(eq(apiKeys.id, keyRecord.id));

  return {
    userId: keyRecord.userId,
    organizationId: keyRecord.organizationId,
    scopes: keyRecord.scopes,
  };
}
