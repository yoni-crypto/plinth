const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const defaultConfig: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
};

export function checkRateLimit(
  key: string,
  config: Partial<RateLimitConfig> = {}
): { allowed: boolean; remaining: number; resetAt: number } {
  const { windowMs, maxRequests } = { ...defaultConfig, ...config };
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count++;
  return { allowed: true, remaining: maxRequests - record.count, resetAt: record.resetAt };
}

export function getRateLimitHeaders(result: ReturnType<typeof checkRateLimit>) {
  return {
    "X-RateLimit-Limit": String(defaultConfig.maxRequests),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };
}
