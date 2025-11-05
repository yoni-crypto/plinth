import crypto from "crypto";
import { db } from "@/lib/db/client";
import { webhooks, webhookDeliveries } from "./schema";
import { eq, and } from "drizzle-orm";

export async function createWebhook(input: {
  organizationId: string;
  url: string;
  events?: string[];
}) {
  const secret = crypto.randomBytes(32).toString("hex");

  const [webhook] = await db
    .insert(webhooks)
    .values({
      organizationId: input.organizationId,
      url: input.url,
      secret,
      events: input.events || ["*"],
    })
    .returning();

  return webhook;
}

export async function deleteWebhook(id: string) {
  await db.delete(webhooks).where(eq(webhooks.id, id));
}

export async function getOrganizationWebhooks(organizationId: string) {
  return db.query.webhooks.findMany({
    where: eq(webhooks.organizationId, organizationId),
  });
}

export async function triggerWebhook(input: {
  organizationId: string;
  event: string;
  payload: Record<string, unknown>;
}) {
  const orgWebhooks = await db.query.webhooks.findMany({
    where: and(
      eq(webhooks.organizationId, input.organizationId),
      eq(webhooks.active, "active")
    ),
  });

  for (const webhook of orgWebhooks) {
    if (webhook.events && !webhook.events.includes("*") && !webhook.events.includes(input.event)) {
      continue;
    }

    const body = JSON.stringify({
      event: input.event,
      data: input.payload,
      timestamp: new Date().toISOString(),
    });

    const signature = crypto
      .createHmac("sha256", webhook.secret)
      .update(body)
      .digest("hex");

    try {
      const res = await fetch(webhook.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Plinth-Signature": `sha256=${signature}`,
          "X-Plinth-Event": input.event,
        },
        body,
      });

      await db.insert(webhookDeliveries).values({
        webhookId: webhook.id,
        event: input.event,
        payload: input.payload,
        statusCode: res.status,
        response: await res.text().catch(() => ""),
        deliveredAt: new Date(),
      });
    } catch (error) {
      await db.insert(webhookDeliveries).values({
        webhookId: webhook.id,
        event: input.event,
        payload: input.payload,
        response: error instanceof Error ? error.message : "Delivery failed",
      });
    }
  }
}

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature.replace("sha256=", "")),
    Buffer.from(expected)
  );
}
