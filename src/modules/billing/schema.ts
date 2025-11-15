import { pgTable, uuid, varchar, text, timestamp, jsonb, integer, index } from "drizzle-orm/pg-core";
import { organizations } from "@/lib/db/schema";

export const plans = pgTable("plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  price: integer("price").notNull().default(0),
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  interval: varchar("interval", { length: 20 }).default("month").notNull(),
  features: jsonb("features").$type<string[]>().default([]),
  limits: jsonb("limits").$type<PlanLimits>().default({}),
  stripePriceId: varchar("stripe_price_id", { length: 255 }),
  active: varchar("status", { length: 20 }).default("active").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    planId: uuid("plan_id")
      .notNull()
      .references(() => plans.id),
    status: varchar("status", { length: 20 }).default("active").notNull(),
    externalId: varchar("external_id", { length: 255 }),
    currentPeriodStart: timestamp("current_period_start", { mode: "date" }),
    currentPeriodEnd: timestamp("current_period_end", { mode: "date" }),
    cancelAt: timestamp("cancel_at", { mode: "date" }),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("subscriptions_organization_id_idx").on(table.organizationId),
    index("subscriptions_status_idx").on(table.status),
  ]
);

export const invoices = pgTable(
  "invoices",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    subscriptionId: uuid("subscription_id").references(() => subscriptions.id),
    amount: integer("amount").notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    status: varchar("status", { length: 20 }).default("pending").notNull(),
    externalId: varchar("external_id", { length: 255 }),
    pdfUrl: text("pdf_url"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("invoices_organization_id_idx").on(table.organizationId),
  ]
);

export type PlanLimits = {
  teamMembers?: number;
  projects?: number;
  storage?: number; // bytes
  apiCalls?: number;
  [key: string]: number | undefined;
};
