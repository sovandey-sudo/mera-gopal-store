import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateCart } from "@/lib/pricing/calculate";

const schema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().positive(),
    })
  ),
});

/**
 * POST /api/cart/calculate
 * Body: { items: [{ productId, quantity }] }
 *
 * Returns authoritative prices, stock checks, and bundle discount.
 * Frontend must use these values — never trust client-side totals.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = await calculateCart(parsed.data.items);

    return NextResponse.json(result);
  } catch (e) {
    console.error("Cart calculation error:", e);
    return NextResponse.json(
      { error: "Failed to calculate cart" },
      { status: 500 }
    );
  }
}
