import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

async function getProducts(filter?: string) {
  try {
    const where: any = {};
    if (filter === "low-stock") {
      where.isActive = true;
      where.stockQuantity = { lte: 5 };
    }
    return await prisma.product.findMany({
      where,
      include: { category: true, images: { where: { isPrimary: true }, take: 1 } },
      orderBy: { updatedAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const params = await searchParams;
  const products = await getProducts(params.filter);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#2c1810]">Products</h2>
          <p className="text-sm text-[#2c1810]/60">{products.length} products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center px-4 py-2 bg-[#8B0000] text-white text-sm font-medium rounded-lg hover:bg-[#6B0000]"
        >
          + Add Product
        </Link>
      </div>

      <div className="bg-white border border-[#e8dfd0] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f5f0e8] text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-[#2c1810]/70">Product</th>
                <th className="px-4 py-3 font-medium text-[#2c1810]/70 hidden sm:table-cell">SKU</th>
                <th className="px-4 py-3 font-medium text-[#2c1810]/70">Price</th>
                <th className="px-4 py-3 font-medium text-[#2c1810]/70">Stock</th>
                <th className="px-4 py-3 font-medium text-[#2c1810]/70 hidden md:table-cell">Status</th>
                <th className="px-4 py-3 font-medium text-[#2c1810]/70">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8dfd0]">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#2c1810]/50">
                    No products found.{" "}
                    <Link href="/admin/products/new" className="text-[#8B0000] hover:underline">
                      Add your first product
                    </Link>
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#faf7f2]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-[#f5f0e8] flex items-center justify-center text-lg flex-shrink-0">
                          🪔
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[#2c1810] truncate max-w-[180px]">{p.name}</p>
                          <p className="text-xs text-[#2c1810]/50">{p.category.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#2c1810]/70 hidden sm:table-cell">{p.sku}</td>
                    <td className="px-4 py-3 font-medium">{formatPrice(Number(p.price))}</td>
                    <td className="px-4 py-3">
                      <span className={p.stockQuantity <= 5 ? "text-amber-600 font-medium" : ""}>
                        {p.stockQuantity}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                          p.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {p.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="text-[#8B0000] hover:underline text-sm"
                      >
                        Edit
                      </Link>
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
