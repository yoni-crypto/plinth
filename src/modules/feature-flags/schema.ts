import { pgTable, uuid, varchar, text, timestamp, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { users, organizations } from "@/lib/db/schema";

export const featureFlags = pgTable(
  "feature_flags",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).notNull().unique(),
    description: text("description"),
    enabled: boolean("enabled").default(false).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  }
);

export const featureFlagOverrides = pgTable(
  "feature_flag_overrides",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    flagId: uuid("flag_id")
      .notNull()
      .references(() => featureFlags.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    organizationId: uuid("organization_id").references(() => organizations.id, {
      onDelete: "cascade",
    }),
    enabled: boolean("enabled").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("feature_flag_overrides_flag_id_idx").on(table.flagId),
    index("feature_flag_overrides_user_id_idx").on(table.userId),
    index("feature_flag_overrides_organization_id_idx").on(table.organizationId),
  ]
);
