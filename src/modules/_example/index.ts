import { db } from "@/lib/db/client";
import { items } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { Item, NewItem } from "./schema";

export async function getItems(): Promise<Item[]> {
  return db.query.items.findMany({
    orderBy: (items, { desc }) => [desc(items.createdAt)],
  });
}

export async function getItemById(id: string): Promise<Item | undefined> {
  return db.query.items.findFirst({
    where: eq(items.id, id),
  });
}

export async function createItem(input: NewItem): Promise<Item> {
  const [item] = await db.insert(items).values(input).returning();
  return item;
}

export async function updateItem(id: string, input: Partial<NewItem>): Promise<Item | undefined> {
  const [item] = await db
    .update(items)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(items.id, id))
    .returning();
  return item;
}

export async function deleteItem(id: string): Promise<boolean> {
  const result = await db.delete(items).where(eq(items.id, id));
  return result.rowCount !== null && result.rowCount > 0;
}
