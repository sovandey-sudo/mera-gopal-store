import { createHmac, timingSafeEqual } from "crypto";

/**
 * Signed, time-limited guest order access token.
 * Prevents IDOR on order confirmation for guest checkouts.
 */
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is required for order tokens");
  }
  return secret;
}

export function createOrderAccessToken(orderId: string, orderNumber: string): string {
  const exp = Date.now() + TOKEN_TTL_MS;
  const payload = `${orderId}.${orderNumber}.${exp}`;
  const sig = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return Buffer.from(`${payload}.${sig}`).toString("base64url");
}

export function verifyOrderAccessToken(
  token: string,
  orderId: string,
  orderNumber: string
): boolean {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const parts = decoded.split(".");
    if (parts.length !== 4) return false;

    const [tokOrderId, tokOrderNumber, expStr, sig] = parts;
    const exp = parseInt(expStr, 10);
    if (Number.isNaN(exp) || Date.now() > exp) return false;
    if (tokOrderId !== orderId || tokOrderNumber !== orderNumber) return false;

    const payload = `${tokOrderId}.${tokOrderNumber}.${expStr}`;
    const expected = createHmac("sha256", getSecret()).update(payload).digest("hex");

    const a = Buffer.from(sig, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
