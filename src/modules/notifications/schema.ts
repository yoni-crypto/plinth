import { pgTable, uuid, varchar, text, timestamp, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { users } from "@/lib/db/schema";

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message"),
    type: varchar("type", { length: 50 }).default("info").notNull(),
    read: boolean("read").default(false).notNull(),
    actionUrl: text("action_url"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("notifications_user_id_idx").on(table.userId),
    index("notifications_read_idx").on(table.read),
  ]
);
