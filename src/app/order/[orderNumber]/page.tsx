import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { verifyOrderAccessToken } from "@/lib/security/order-token";

interface Props {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ status?: string; token?: string }>;
}

/**
 * Order confirmation — server-side authorization required.
 * Authenticated: must own the order (customerId match).
 * Guest: must present a valid signed access token.
 */
export default async function OrderConfirmationPage({ params, searchParams }: Props) {
  const { orderNumber } = await params;
  const { status, token } = await searchParams;
  const session = await auth();

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      payments: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  if (!order) notFound();

  // Authorization
  const isOwner = !!session?.user?.id && order.customerId === session.user.id;
  const isAdmin =
    session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";
  const hasValidGuestToken =
    !!token && verifyOrderAccessToken(token, order.id, order.orderNumber);

  if (!isOwner && !isAdmin && !hasValidGuestToken) {
    // Do not reveal whether the order exists to unauthorized users beyond 404
    if (!session?.user) {
      redirect(`/login?callbackUrl=${encodeURIComponent(`/order/${orderNumber}`)}`);
    }
    notFound();
  }

  const isSuccess =
    status === "success" ||
    order.paymentStatus === "PAID" ||
    order.orderStatus === "CONFIRMED";

  return (
    <div className="max-w-lg mx-auto px-4 py-12 text-center">
      {isSuccess ? (
        <>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center text-3xl">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-[#2c1810] mb-2">Order Confirmed</h1>
          <p className="text-[#2c1810]/70 mb-6">
            Thank you for your order. We have received your payment.
          </p>
        </>
      ) : (
        <>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center text-3xl">
            !
          </div>
          <h1 className="text-2xl font-bold text-[#2c1810] mb-2">Order Received</h1>
          <p className="text-[#2c1810]/70 mb-6">
            Your order was created. Payment status: {order.paymentStatus}
          </p>
        </>
      )}

      <div className="bg-white border border-[#e8dfd0] rounded-xl p-5 text-left mb-6">
        <div className="flex justify-between text-sm mb-3">
          <span className="text-[#2c1810]/60">Order Number</span>
          <span className="font-semibold">{order.orderNumber}</span>
        </div>
        <div className="flex justify-between text-sm mb-3">
          <span className="text-[#2c1810]/60">Status</span>
          <span>{order.orderStatus}</span>
        </div>
        <div className="flex justify-between text-sm mb-3">
          <span className="text-[#2c1810]/60">Payment</span>
          <span>{order.paymentStatus}</span>
        </div>
        <div className="border-t border-[#e8dfd0] pt-3 mt-3">
          <ul className="space-y-1 text-sm">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>
                  {item.productNameSnapshot} × {item.quantity}
                </span>
                <span>{formatPrice(Number(item.total))}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-bold mt-3 pt-2 border-t border-[#e8dfd0]">
            <span>Total</span>
            <span className="text-[#8B0000]">{formatPrice(Number(order.total))}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/account/orders">
          <Button variant="outline">View My Orders</Button>
        </Link>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
