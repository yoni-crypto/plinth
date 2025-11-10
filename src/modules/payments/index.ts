import type { PaymentProvider, WebhookEvent } from "./types";
import { createStripeAdapter } from "./providers/stripe";
import { createChapaAdapter } from "./providers/chapa";

let provider: PaymentProvider | null = null;

export function getPaymentProvider(): PaymentProvider {
  if (provider) return provider;

  const paymentProvider = process.env.PAYMENT_PROVIDER || "stripe";

  switch (paymentProvider) {
    case "stripe":
      provider = createStripeAdapter();
      break;
    case "chapa":
      provider = createChapaAdapter();
      break;
    default:
      throw new Error(`Unknown payment provider: ${paymentProvider}`);
  }

  return provider;
}

export type { PaymentProvider, WebhookEvent };
