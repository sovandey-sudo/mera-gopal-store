import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createOrderAccessToken, verifyOrderAccessToken } from "@/lib/security/order-token";

/**
 * Mock payment failure / cancellation.
 * Restores stock once if order still PENDING.
 * Requires owner session or valid guest access token.
 */
export async function GET(req: Request) {
  if ((process.env.PAYMENT_PROVIDER || "mock") !== "mock") {
    return NextResponse.json({ error: "Mock payment is disabled" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");
  const accessToken = searchParams.get("token");

  if (!orderId) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

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

    // Only restore if still pending (idempotent)
    if (order.paymentStatus === "PENDING" && order.orderStatus === "PENDING") {
      await prisma.$transaction(async (tx) => {
        for (const item of order.items) {
          if (item.productId) {
            await tx.product.update({
              where: { id: item.productId },
              data: { stockQuantity: { increment: item.quantity } },
            });
          }
        }

        await tx.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: "FAILED",
            orderStatus: "CANCELLED",
          },
        });

        await tx.payment.updateMany({
          where: { orderId, status: "PENDING" },
          data: { status: "FAILED" },
        });
      });
    }

    const token = createOrderAccessToken(order.id, order.orderNumber);
    const baseUrl =
      process.env.AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
    return NextResponse.redirect(
      `${baseUrl}/order/${order.orderNumber}?status=failed&token=${token}`
    );
  } catch (e) {
    console.error("Mock payment fail error:", e);
    return NextResponse.json({ error: "Failed to process cancellation" }, { status: 500 });
  }
}
