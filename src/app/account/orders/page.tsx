import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Strict ownership filter — customer can only see their own orders
  const orders = await prisma.order.findMany({
    where: { customerId: session.user.id },
    include: {
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <Link href="/account" className="text-sm text-[#8B0000] hover:underline">
          ← Back to Account
        </Link>
        <h1 className="text-2xl font-bold text-[#2c1810] mt-2">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-[#e8dfd0] rounded-xl p-8 text-center">
          <p className="text-[#2c1810]/60 mb-4">You haven&apos;t placed any orders yet.</p>
          <Link
            href="/products"
            className="inline-flex px-4 py-2 bg-[#8B0000] text-white text-sm font-medium rounded-lg hover:bg-[#6B0000]"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="bg-white border border-[#e8dfd0] rounded-xl p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div>
                  <p className="font-semibold text-[#2c1810]">{order.orderNumber}</p>
                  <p className="text-xs text-[#2c1810]/50">
                    {order.createdAt.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#8B0000]">
                    {formatPrice(Number(order.total))}
                  </p>
                  <span className="inline-flex mt-1 px-2 py-0.5 rounded text-xs font-medium bg-[#f5f0e8] text-[#2c1810]">
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              <ul className="text-sm text-[#2c1810]/70 space-y-1 border-t border-[#e8dfd0] pt-3">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>
                      {item.productNameSnapshot} × {item.quantity}
                    </span>
                    <span>{formatPrice(Number(item.total))}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
