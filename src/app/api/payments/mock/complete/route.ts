import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPaymentProvider } from "@/lib/payments";
import { createOrderAccessToken, verifyOrderAccessToken } from "@/lib/security/order-token";

/**
 * Mock payment success.
 * Requires:
 * - PAYMENT_PROVIDER=mock
 * - Valid order + matching payment providerOrderId
 * - Access: order owner session OR valid guest access token
 * Amount always taken from order.total (never client).
 */
export async function GET(req: Request) {
  if ((process.env.PAYMENT_PROVIDER || "mock") !== "mock") {
    return NextResponse.json({ error: "Mock payment is disabled" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");
  const providerOrderId = searchParams.get("providerOrderId");
  const accessToken = searchParams.get("token");

  if (!orderId || !providerOrderId) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Access control: owner, admin, or guest token
    const session = await auth();
    const isOwner = !!session?.user?.id && order.customerId === session.user.id;
    const isAdmin =
      session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";
    const hasGuestToken =
      !!accessToken &&
      verifyOrderAccessToken(accessToken, order.id, order.orderNumber);

    if (!isOwner && !isAdmin && !hasGuestToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const payment = await prisma.payment.findFirst({
      where: { orderId, providerOrderId },
    });
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    const token = createOrderAccessToken(order.id, order.orderNumber);
    const baseUrl =
      process.env.AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

    // Idempotent: already paid
    if (order.paymentStatus === "PAID") {
      return NextResponse.redirect(
        `${baseUrl}/order/${order.orderNumber}?status=success&token=${token}`
      );
    }

    const provider = getPaymentProvider();
    if (provider.name !== "mock") {
      return NextResponse.json({ error: "Mock payment is disabled" }, { status: 403 });
    }

    const verification = await provider.verifyPayment({ providerOrderId });

    if (verification.success && verification.status === "PAID") {
      await prisma.$transaction([
        prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: "PAID",
            orderStatus: "CONFIRMED",
          },
        }),
        prisma.payment.updateMany({
          where: { orderId, providerOrderId },
          data: {
            status: "PAID",
            amount: order.total,
            providerPaymentId: verification.providerPaymentId,
            paidAt: new Date(),
          },
        }),
      ]);
    }

    return NextResponse.redirect(
      `${baseUrl}/order/${order.orderNumber}?status=${
        verification.success ? "success" : "failed"
      }&token=${token}`
    );
  } catch (e) {
    console.error("Mock payment complete error:", e);
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 });
  }
}
