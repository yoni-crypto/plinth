import { describe, it, expect, vi, beforeEach } from "vitest";
import crypto from "crypto";

describe("webhooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should verify a valid webhook signature", async () => {
    const mockHmac = {
      update: vi.fn().mockReturnThis(),
      digest: vi.fn().mockReturnValue("expected-sig"),
    };
    vi.spyOn(crypto, "createHmac").mockReturnValue(mockHmac as unknown as crypto.Hmac);
    vi.spyOn(crypto, "timingSafeEqual").mockReturnValue(true);

    const { verifyWebhookSignature } = await import("@/modules/webhooks");
    const result = verifyWebhookSignature("payload", "expected-sig", "secret");
    expect(result).toBe(true);
  });

  it("should reject an invalid signature", async () => {
    const mockHmac = {
      update: vi.fn().mockReturnThis(),
      digest: vi.fn().mockReturnValue("expected-sig"),
    };
    vi.spyOn(crypto, "createHmac").mockReturnValue(mockHmac as unknown as crypto.Hmac);
    vi.spyOn(crypto, "timingSafeEqual").mockReturnValue(false);

    const { verifyWebhookSignature } = await import("@/modules/webhooks");
    const result = verifyWebhookSignature("payload", "wrong-sig", "secret");
    expect(result).toBe(false);
  });
});
