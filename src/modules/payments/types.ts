export interface PaymentProvider {
  createCustomer(input: {
    email: string;
    name?: string;
    metadata?: Record<string, string>;
  }): Promise<{ id: string }>;

  createCheckoutSession(input: {
    customerId: string;
    priceId: string;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
  }): Promise<{ id: string; url: string }>;

  createSubscription(input: {
    customerId: string;
    priceId: string;
    metadata?: Record<string, string>;
  }): Promise<{ id: string; status: string }>;

  cancelSubscription(input: { subscriptionId: string }): Promise<void>;

  getSubscription(input: { subscriptionId: string }): Promise<{
    id: string;
    status: string;
    currentPeriodEnd: Date;
  } | null>;

  createBillingPortalSession(input: {
    customerId: string;
    returnUrl: string;
  }): Promise<{ url: string }>;

  handleWebhook(input: {
    payload: string;
    signature: string;
  }): Promise<WebhookEvent>;
}

export type WebhookEvent =
  | { type: "checkout.completed"; data: { customerId: string; subscriptionId?: string } }
  | { type: "subscription.created"; data: { subscriptionId: string; status: string } }
  | { type: "subscription.updated"; data: { subscriptionId: string; status: string } }
  | { type: "subscription.canceled"; data: { subscriptionId: string } }
  | { type: "invoice.paid"; data: { customerId: string; amount: number } }
  | { type: "invoice.payment_failed"; data: { customerId: string } }
  | { type: "unknown"; data: Record<string, unknown> };
