import { pgTable, uuid, varchar, text, timestamp, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { users, organizations } from "@/lib/db/schema";

export const apiKeys = pgTable(
  "api_keys",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    organizationId: uuid("organization_id").references(() => organizations.id, {
      onDelete: "cascade",
    }),
    name: varchar("name", { length: 100 }).notNull(),
    keyPrefix: varchar("key_prefix", { length: 10 }).notNull(),
    keyHash: text("key_hash").notNull(),
    scopes: jsonb("scopes").$type<string[]>().default([]),
    expiresAt: timestamp("expires_at", { mode: "date" }),
    lastUsedAt: timestamp("last_used_at", { mode: "date" }),
    revokedAt: timestamp("revoked_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("api_keys_user_id_idx").on(table.userId),
    index("api_keys_key_prefix_idx").on(table.keyPrefix),
  ]
);
