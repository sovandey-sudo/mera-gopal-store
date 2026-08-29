import { NextResponse } from "next/server";
import { z } from "zod";
import { getAstrologyService } from "@/lib/astrology";
import { getGemstoneRecommendations } from "@/lib/astrology/recommend";
import { checkRateLimit, clientKey, RATE_LIMITS } from "@/lib/security/rate-limit";

const schema = z.object({
  // Optional birth data — if provided we attempt calculation first
  name: z.string().optional(),
  dateOfBirth: z.string().optional(),
  timeOfBirth: z.string().optional(),
  placeOfBirth: z.string().optional(),
  // Or pass a pre-computed chart result
  chart: z.any().optional(),
});

/**
 * POST /api/astrology/recommend
 * Returns gemstone recommendations from the rule engine + matched catalog products.
 */
export async function POST(req: Request) {
  const rl = checkRateLimit(clientKey(req, "astrology"), RATE_LIMITS.astrology);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    let chart = parsed.data.chart ?? null;

    // If birth data provided, try calculation
    if (
      !chart &&
      parsed.data.dateOfBirth &&
      parsed.data.timeOfBirth &&
      parsed.data.placeOfBirth
    ) {
      const service = getAstrologyService();
      chart = await service.calculate({
        name: parsed.data.name || "User",
        dateOfBirth: parsed.data.dateOfBirth,
        timeOfBirth: parsed.data.timeOfBirth,
        placeOfBirth: parsed.data.placeOfBirth,
      });
    }

    const result = await getGemstoneRecommendations(chart);

    return NextResponse.json(result);
  } catch (e) {
    console.error("Recommendation error:", e);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}

/** GET — return recommendations without chart (general rules) */
export async function GET(req: Request) {
  const rl = checkRateLimit(clientKey(req, "astrology"), RATE_LIMITS.astrology);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );
  }

  try {
    const result = await getGemstoneRecommendations(null);
    return NextResponse.json(result);
  } catch (e) {
    console.error("Recommendation error:", e);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
