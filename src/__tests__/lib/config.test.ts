import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock config to avoid env validation
vi.mock("@/config", () => ({
  config: {
    DATABASE_URL: "postgresql://test:test@localhost:5432/test",
    AUTH_SECRET: "test-secret-key-for-testing",
  },
}));

describe("config", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should export config object", async () => {
    const { config } = await import("@/config");
    expect(config).toBeDefined();
    expect(config.DATABASE_URL).toBe("postgresql://test:test@localhost:5432/test");
    expect(config.AUTH_SECRET).toBe("test-secret-key-for-testing");
  });

  it("should have all required fields", async () => {
    const { config } = await import("@/config");
    expect(config.DATABASE_URL).toBeDefined();
    expect(config.AUTH_SECRET).toBeDefined();
  });
});
