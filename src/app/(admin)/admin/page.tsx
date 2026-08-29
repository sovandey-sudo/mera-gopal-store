import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

async function getStats() {
  try {
    const [
      totalProducts,
      activeProducts,
      lowStock,
      totalOrders,
      pendingOrders,
      totalCategories,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({
        where: {
          isActive: true,
          stockQuantity: { lte: prisma.product.fields.lowStockThreshold as any },
        },
      }).catch(() =>
        prisma.product.count({
          where: { isActive: true, stockQuantity: { lte: 5 } },
        })
      ),
      prisma.order.count(),
      prisma.order.count({ where: { orderStatus: "PENDING" } }),
      prisma.category.count({ where: { isActive: true } }),
    ]);

    // Simpler low stock query
    const lowStockProducts = await prisma.product.findMany({
      where: { isActive: true, stockQuantity: { lte: 5 } },
      select: { id: true, name: true, stockQuantity: true },
      take: 5,
    });

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { customer: { select: { name: true, email: true } } },
    });

    return {
      totalProducts,
      activeProducts,
      lowStock: lowStockProducts.length,
      lowStockProducts,
      totalOrders,
      pendingOrders,
      totalCategories,
      recentOrders,
    };
  } catch {
    return {
      totalProducts: 0,
      activeProducts: 0,
      lowStock: 0,
      lowStockProducts: [],
      totalOrders: 0,
      pendingOrders: 0,
      totalCategories: 0,
      recentOrders: [],
    };
  }
}

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const stats = await getStats();

  const cards = [
    { label: "Total Products", value: stats.totalProducts, href: "/admin/products" },
    { label: "Active Products", value: stats.activeProducts, href: "/admin/products" },
    { label: "Low Stock", value: stats.lowStock, href: "/admin/products?filter=low-stock", alert: stats.lowStock > 0 },
    { label: "Categories", value: stats.totalCategories, href: "/admin/categories" },
    { label: "Total Orders", value: stats.totalOrders, href: "/admin/orders" },
    { label: "Pending Orders", value: stats.pendingOrders, href: "/admin/orders?status=PENDING", alert: stats.pendingOrders > 0 },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#2c1810]">
          Welcome back{session.user.name ? `, ${session.user.name}` : ""}
        </h2>
        <p className="text-sm text-[#2c1810]/60">Overview of your store</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white border border-[#e8dfd0] rounded-xl p-4 hover:shadow-sm transition-shadow"
          >
            <p className="text-xs text-[#2c1810]/60 mb-1">{card.label}</p>
            <p className={`text-2xl font-bold ${card.alert ? "text-amber-600" : "text-[#2c1810]"}`}>
              {card.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Low stock */}
        <div className="bg-white border border-[#e8dfd0] rounded-xl p-5">
          <h3 className="font-semibold text-[#2c1810] mb-3">Low Stock Alert</h3>
          {stats.lowStockProducts.length === 0 ? (
            <p className="text-sm text-[#2c1810]/50">All products have sufficient stock.</p>
          ) : (
            <ul className="space-y-2">
              {stats.lowStockProducts.map((p) => (
                <li key={p.id} className="flex justify-between text-sm">
                  <Link href={`/admin/products/${p.id}/edit`} className="text-[#2c1810] hover:text-[#8B0000] truncate">
                    {p.name}
                  </Link>
                  <span className="text-amber-600 font-medium">{p.stockQuantity} left</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent orders */}
        <div className="bg-white border border-[#e8dfd0] rounded-xl p-5">
          <h3 className="font-semibold text-[#2c1810] mb-3">Recent Orders</h3>
          {stats.recentOrders.length === 0 ? (
            <p className="text-sm text-[#2c1810]/50">No orders yet.</p>
          ) : (
            <ul className="space-y-2">
              {stats.recentOrders.map((o) => (
                <li key={o.id} className="flex justify-between text-sm">
                  <span className="text-[#2c1810]">{o.orderNumber}</span>
                  <span className="text-[#2c1810]/60">{formatPrice(Number(o.total))}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/products/new"
          className="inline-flex items-center px-4 py-2 bg-[#8B0000] text-white text-sm font-medium rounded-lg hover:bg-[#6B0000]"
        >
          + Add Product
        </Link>
        <Link
          href="/admin/categories"
          className="inline-flex items-center px-4 py-2 border border-[#e8dfd0] bg-white text-sm font-medium rounded-lg hover:bg-[#f5f0e8]"
        >
          Manage Categories
        </Link>
      </div>
    </div>
  );
}
