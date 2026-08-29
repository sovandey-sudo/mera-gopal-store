import { NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes } from "crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateCart } from "@/lib/pricing/calculate";
import { getPaymentProvider } from "@/lib/payments";
import { createOrderAccessToken } from "@/lib/security/order-token";
import { checkRateLimit, clientKey, RATE_LIMITS } from "@/lib/security/rate-limit";

const schema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().positive(),
    })
  ),
  addressId: z.string().optional(),
  guestName: z.string().optional(),
  guestEmail: z.string().email().optional(),
  guestPhone: z.string().optional(),
  shipping: z
    .object({
      fullName: z.string().min(1),
      phone: z.string().min(1),
      addressLine1: z.string().min(1),
      addressLine2: z.string().optional(),
      city: z.string().min(1),
      state: z.string().min(1),
      postalCode: z.string().min(1),
      country: z.string().default("India"),
    })
    .optional(),
});

function generateOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DS-${ts}-${rand}`;
}

/**
 * POST /api/checkout
 * - Authenticated: order belongs to session user
 * - Guest: new ephemeral guest user (never attaches to existing account by email)
 * - Stock: over-quantity rejected; conditional reservation prevents oversell
 */
export async function POST(req: Request) {
  const rl = checkRateLimit(clientKey(req, "checkout"), RATE_LIMITS.checkout);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfterSeconds) },
      }
    );
  }

  try {
    const session = await auth();
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const calc = await calculateCart(data.items);

    // Reject checkout when stock/availability errors exist (do not partially fulfill)
    if (calc.hasStockErrors || calc.errors.length > 0) {
      return NextResponse.json(
        {
          error: "Unable to complete checkout due to stock or availability issues",
          errors: calc.errors,
        },
        { status: 409 }
      );
    }

    if (calc.lines.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    let customerId = session?.user?.id;
    let contactEmail = session?.user?.email || data.guestEmail || undefined;
    let contactName = session?.user?.name || data.guestName || undefined;

    if (!customerId) {
      // Guest checkout — do NOT look up existing users by email (prevents account hijack)
      if (!data.guestEmail || !data.guestName) {
        return NextResponse.json(
          { error: "Please sign in or provide guest name and email" },
          { status: 400 }
        );
      }

      // Ephemeral guest account: unique synthetic email; real contact in shipping snapshot
      const guestToken = randomBytes(12).toString("hex");
      const syntheticEmail = `guest+${guestToken}@guest.local`;

      const guest = await prisma.user.create({
        data: {
          email: syntheticEmail,
          name: data.guestName,
          phone: data.guestPhone || null,
          role: "CUSTOMER",
          // No password — cannot log in as this guest user
        },
      });
      customerId = guest.id;
      contactEmail = data.guestEmail;
      contactName = data.guestName;
    }

    let shippingSnap = {
      shippingName: data.shipping?.fullName || contactName || "",
      shippingPhone: data.shipping?.phone || data.guestPhone || "",
      shippingLine1: data.shipping?.addressLine1 || "",
      shippingLine2: data.shipping?.addressLine2 || null,
      shippingCity: data.shipping?.city || "",
      shippingState: data.shipping?.state || "",
      shippingPostal: data.shipping?.postalCode || "",
      shippingCountry: data.shipping?.country || "India",
    };

    // Store guest contact email in line2 note area if not already set (for fulfillment)
    if (!session?.user && contactEmail) {
      const note = `Guest contact: ${contactEmail}`;
      shippingSnap.shippingLine2 = shippingSnap.shippingLine2
        ? `${shippingSnap.shippingLine2} | ${note}`
        : note;
    }

    let shippingAddressId: string | undefined;

    if (data.addressId && session?.user) {
      const addr = await prisma.address.findFirst({
        where: { id: data.addressId, userId: session.user.id },
      });
      if (addr) {
        shippingAddressId = addr.id;
        shippingSnap = {
          shippingName: addr.fullName,
          shippingPhone: addr.phone,
          shippingLine1: addr.addressLine1,
          shippingLine2: addr.addressLine2,
          shippingCity: addr.city,
          shippingState: addr.state,
          shippingPostal: addr.postalCode,
          shippingCountry: addr.country,
        };
      }
    }

    if (!shippingSnap.shippingLine1) {
      return NextResponse.json(
        { error: "Shipping address is required" },
        { status: 400 }
      );
    }

    const orderNumber = generateOrderNumber();

    const order = await prisma.$transaction(async (tx) => {
      for (const line of calc.lines) {
        const updated = await tx.product.updateMany({
          where: {
            id: line.productId,
            stockQuantity: { gte: line.quantity },
            isActive: true,
          },
          data: {
            stockQuantity: { decrement: line.quantity },
          },
        });

        if (updated.count !== 1) {
          throw new Error(`INSUFFICIENT_STOCK:${line.name || line.productId}`);
        }
      }

      return tx.order.create({
        data: {
          orderNumber,
          customerId,
          shippingAddressId: shippingAddressId || null,
          subtotal: calc.subtotal,
          discount: calc.bundle.discountAmount,
          shippingFee: calc.shippingFee,
          tax: 0,
          total: calc.total,
          paymentStatus: "PENDING",
          orderStatus: "PENDING",
          ...shippingSnap,
          items: {
            create: calc.lines.map((line) => ({
              productId: line.productId,
              productNameSnapshot: line.name,
              productSkuSnapshot: line.sku,
              priceSnapshot: line.unitPrice,
              quantity: line.quantity,
              discount: 0,
              total: line.lineTotal,
            })),
          },
        },
        include: { items: true },
      });
    });

    const provider = getPaymentProvider();
    const baseUrl =
      process.env.AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

    const accessToken = createOrderAccessToken(order.id, order.orderNumber);

    const paymentResult = await provider.createPayment({
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: Number(order.total),
      currency: "INR",
      customerEmail: contactEmail,
      customerName: contactName,
      successUrl: `${baseUrl}/order/${order.orderNumber}?status=success&token=${accessToken}`,
      failureUrl: `${baseUrl}/api/payments/mock/fail?orderId=${order.id}&token=${accessToken}`,
      accessToken,
    });

    if (!paymentResult.success) {
      await prisma.$transaction(async (tx) => {
        for (const line of calc.lines) {
          await tx.product.update({
            where: { id: line.productId },
            data: { stockQuantity: { increment: line.quantity } },
          });
        }
        await tx.order.update({
          where: { id: order.id },
          data: { paymentStatus: "FAILED", orderStatus: "CANCELLED" },
        });
      });

      return NextResponse.json(
        { error: paymentResult.error || "Payment initiation failed" },
        { status: 502 }
      );
    }

    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: order.total,
        currency: "INR",
        status: "PENDING",
        provider: provider.name,
        providerOrderId: paymentResult.providerOrderId,
        providerPaymentId: paymentResult.providerPaymentId,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      total: Number(order.total),
      checkoutUrl: paymentResult.checkoutUrl,
      accessToken,
      provider: paymentResult.provider,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.startsWith("INSUFFICIENT_STOCK:")) {
      const name = msg.replace("INSUFFICIENT_STOCK:", "");
      return NextResponse.json(
        { error: `Insufficient stock for "${name}". Please update your cart.` },
        { status: 409 }
      );
    }
    console.error("Checkout error:", e);
    return NextResponse.json(
      { error: "Checkout failed. Please try again." },
      { status: 500 }
    );
  }
}
