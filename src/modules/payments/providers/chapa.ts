import type { PaymentProvider, WebhookEvent } from "../types";

export function createChapaAdapter(): PaymentProvider {
  const secretKey = process.env.CHAPA_SECRET_KEY;
  if (!secretKey) throw new Error("CHAPA_SECRET_KEY is required");

  const baseUrl = "https://api.chapa.co/v1";

  return {
    async createCustomer({ email, name }) {
      // Chapa doesn't have a separate customer API, return a generated ID
      return { id: `chapa_${Buffer.from(email).toString("base64").slice(0, 20)}` };
    },

    async createCheckoutSession({ customerId, priceId, successUrl, cancelUrl, metadata }) {
      const ref = `tx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      const res = await fetch(`${baseUrl}/initialize`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseInt(priceId, 10), // Chapa uses amount directly
          currency: "ETB",
          tx_ref: ref,
          callback_url: successUrl,
          return_url: cancelUrl,
          meta: metadata,
        }),
      });

      const data = await res.json();
      if (data.status !== "success") {
        throw new Error(data.message || "Chapa checkout failed");
      }

      return { id: ref, url: data.data.checkout_url };
    },

    async createSubscription({ customerId, priceId }) {
      // Chapa doesn't have native subscriptions, create a one-time payment
      return this.createCheckoutSession({
        customerId,
        priceId,
        successUrl: "",
        cancelUrl: "",
      }).then((s) => ({ id: s.id, status: "active" }));
    },

    async cancelSubscription() {
      // Chapa doesn't have native subscriptions
    },

    async getSubscription() {
      return null;
    },

    async createBillingPortalSession() {
      return { url: "#" };
    },

    async handleWebhook({ payload, signature }) {
      const event = JSON.parse(payload);

      switch (event.event) {
        case "charge.completed":
          return {
            type: "invoice.paid",
            data: {
              customerId: event.data.customer_id || "",
              amount: event.data.amount,
            },
          };
        default:
          return { type: "unknown", data: event };
      }
    },
  };
}
