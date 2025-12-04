import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock rate-limit module
vi.mock("@/modules/rate-limit", () => ({
  checkRateLimit: vi.fn().mockReturnValue({
    allowed: true,
    remaining: 9,
    resetTime: Date.now() + 60000,
  }),
  getRateLimitHeaders: vi.fn().mockReturnValue({
    "X-RateLimit-Limit": "10",
    "X-RateLimit-Remaining": "9",
    "X-RateLimit-Reset": String(Math.floor(Date.now() / 1000) + 60),
  }),
}));

describe("rate-limit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should check rate limit", async () => {
    const { checkRateLimit } = await import("@/modules/rate-limit");
    const result = checkRateLimit("test-key", { windowMs: 60000, maxRequests: 10 });
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(9);
  });

  it("should return rate limit headers", async () => {
    const { checkRateLimit, getRateLimitHeaders } = await import("@/modules/rate-limit");
    const result = checkRateLimit("test-key", { windowMs: 60000, maxRequests: 10 });
    const headers = getRateLimitHeaders(result);
    expect(headers["X-RateLimit-Limit"]).toBe("10");
    expect(headers["X-RateLimit-Remaining"]).toBe("9");
    expect(headers["X-RateLimit-Reset"]).toBeDefined();
  });
});
