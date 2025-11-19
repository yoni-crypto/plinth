import { NextRequest, NextResponse } from "next/server";
import { getPaymentProvider } from "@/modules/payments";
import { createSubscription, cancelSubscription } from "@/modules/billing";
import { logAudit } from "@/modules/audit";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature") || "";

    const provider = getPaymentProvider();
    const event = await provider.handleWebhook({ payload: body, signature });

    switch (event.type) {
      case "checkout.completed": {
        if (event.data.subscriptionId) {
          await createSubscription({
            organizationId: event.data.customerId,
            planId: event.data.subscriptionId,
            externalId: event.data.subscriptionId,
          });

          await logAudit({
            action: "subscribe",
            resource: "subscription",
            description: "New subscription created via checkout",
            metadata: { customerId: event.data.customerId },
          });
        }
        break;
      }

      case "subscription.canceled": {
        await cancelSubscription(event.data.subscriptionId);

        await logAudit({
          action: "cancel",
          resource: "subscription",
          description: "Subscription canceled",
          metadata: { subscriptionId: event.data.subscriptionId },
        });
        break;
      }

      case "invoice.paid": {
        await logAudit({
          action: "payment",
          resource: "invoice",
          description: `Payment of ${event.data.amount} received`,
          metadata: { customerId: event.data.customerId, amount: event.data.amount },
        });
        break;
      }

      case "invoice.payment_failed": {
        await logAudit({
          action: "payment_failed",
          resource: "invoice",
          description: "Payment failed",
          metadata: { customerId: event.data.customerId },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook handler failed" },
      { status: 400 }
    );
  }
}
