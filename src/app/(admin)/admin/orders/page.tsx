import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";

export default async function AdminOrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const orders = await prisma.order.findMany({
    include: {
      customer: { select: { name: true, email: true } },
      items: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#2c1810]">Orders</h2>
        <p className="text-sm text-[#2c1810]/60">{orders.length} recent orders</p>
      </div>

      <div className="bg-white border border-[#e8dfd0] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f5f0e8] text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-[#2c1810]/70">Order</th>
                <th className="px-4 py-3 font-medium text-[#2c1810]/70 hidden sm:table-cell">Customer</th>
                <th className="px-4 py-3 font-medium text-[#2c1810]/70">Total</th>
                <th className="px-4 py-3 font-medium text-[#2c1810]/70">Payment</th>
                <th className="px-4 py-3 font-medium text-[#2c1810]/70">Status</th>
                <th className="px-4 py-3 font-medium text-[#2c1810]/70 hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8dfd0]">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#2c1810]/50">
                    No orders yet
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#faf7f2]">
                    <td className="px-4 py-3 font-medium">{o.orderNumber}</td>
                    <td className="px-4 py-3 text-[#2c1810]/70 hidden sm:table-cell">
                      {o.customer.name || o.customer.email}
                    </td>
                    <td className="px-4 py-3 font-medium">{formatPrice(Number(o.total))}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                          o.paymentStatus === "PAID"
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusForm orderId={o.id} currentStatus={o.orderStatus} />
                    </td>
                    <td className="px-4 py-3 text-[#2c1810]/60 hidden md:table-cell">
                      {o.createdAt.toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
