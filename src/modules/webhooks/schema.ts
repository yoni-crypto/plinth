import { pgTable, uuid, varchar, text, timestamp, jsonb, integer, index } from "drizzle-orm/pg-core";
import { organizations } from "@/lib/db/schema";

export const webhooks = pgTable(
  "webhooks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    secret: text("secret").notNull(),
    events: jsonb("events").$type<string[]>().default([]),
    active: varchar("status", { length: 20 }).default("active").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("webhooks_organization_id_idx").on(table.organizationId),
  ]
);

export const webhookDeliveries = pgTable(
  "webhook_deliveries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    webhookId: uuid("webhook_id")
      .notNull()
      .references(() => webhooks.id, { onDelete: "cascade" }),
    event: varchar("event", { length: 100 }).notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
    statusCode: integer("status_code"),
    response: text("response"),
    attempt: integer("attempt").default(1).notNull(),
    deliveredAt: timestamp("delivered_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("webhook_deliveries_webhook_id_idx").on(table.webhookId),
  ]
);
