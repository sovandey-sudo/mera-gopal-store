/**
 * Simple in-memory rate limiter for free-tier deployments.
 * Suitable for single-instance deployments.
 * For multi-instance production, replace with Redis/Upstash.
 */

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

try {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (now > entry.resetAt) store.delete(key);
    }
  }, 60_000).unref?.();
} catch {
  // ignore in edge environments without unref
}

export interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true, remaining: config.limit - 1, retryAfterSeconds: 0 };
  }

  if (entry.count >= config.limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: config.limit - entry.count,
    retryAfterSeconds: 0,
  };
}

export const RATE_LIMITS = {
  login: { limit: 10, windowMs: 15 * 60 * 1000 },
  register: { limit: 5, windowMs: 60 * 60 * 1000 },
  checkout: { limit: 10, windowMs: 15 * 60 * 1000 },
  astrology: { limit: 20, windowMs: 15 * 60 * 1000 },
} as const;

export function clientKey(req: Request, bucket: string): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return `${bucket}:${ip}`;
}
