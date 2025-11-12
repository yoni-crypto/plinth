import Stripe from "stripe";
import type { PaymentProvider, WebhookEvent } from "../types";

export function createStripeAdapter(): PaymentProvider {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error("STRIPE_SECRET_KEY is required");

  const stripe = new Stripe(secretKey);

  return {
    async createCustomer({ email, name, metadata }) {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata,
      });
      return { id: customer.id };
    },

    async createCheckoutSession({ customerId, priceId, successUrl, cancelUrl, metadata }) {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata,
      });
      return { id: session.id, url: session.url! };
    },

    async createSubscription({ customerId, priceId, metadata }) {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        metadata,
      });
      return { id: subscription.id, status: subscription.status };
    },

    async cancelSubscription({ subscriptionId }) {
      await stripe.subscriptions.cancel(subscriptionId);
    },

    async getSubscription({ subscriptionId }) {
      try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const periodEnd = (subscription as unknown as { current_period_end: number }).current_period_end;
        return {
          id: subscription.id,
          status: subscription.status,
          currentPeriodEnd: new Date(periodEnd * 1000),
        };
      } catch {
        return null;
      }
    },

    async createBillingPortalSession({ customerId, returnUrl }) {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });
      return { url: session.url };
    },

    async handleWebhook({ payload, signature }): Promise<WebhookEvent> {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET is required");

      const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

      switch (event.type) {
        case "checkout.session.completed":
          return {
            type: "checkout.completed",
            data: {
              customerId: event.data.object.customer as string,
              subscriptionId: event.data.object.subscription as string | undefined,
            },
          };
        case "customer.subscription.created":
        case "customer.subscription.updated":
          return {
            type: event.type === "customer.subscription.created" ? "subscription.created" : "subscription.updated",
            data: {
              subscriptionId: event.data.object.id,
              status: event.data.object.status,
            },
          };
        case "customer.subscription.deleted":
          return {
            type: "subscription.canceled",
            data: { subscriptionId: event.data.object.id },
          };
        case "invoice.paid":
          return {
            type: "invoice.paid",
            data: {
              customerId: event.data.object.customer as string,
              amount: event.data.object.amount_paid,
            },
          };
        case "invoice.payment_failed":
          return {
            type: "invoice.payment_failed",
            data: { customerId: event.data.object.customer as string },
          };
        default:
          return { type: "unknown", data: {} };
      }
    },
  };
}
