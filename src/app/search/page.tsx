import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/store/ProductCard";
import Link from "next/link";

export const metadata = {
  title: "Search",
};

interface SearchParams {
  q?: string;
}

async function searchProducts(q: string) {
  if (!q || q.trim().length < 2) return [];
  try {
    return await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { shortDescription: { contains: q, mode: "insensitive" } },
          { fullDescription: { contains: q, mode: "insensitive" } },
          { sku: { contains: q, mode: "insensitive" } },
          { category: { name: { contains: q, mode: "insensitive" } } },
        ],
      },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: true,
      },
      take: 40,
    });
  } catch {
    return [];
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() || "";
  const products = q ? await searchProducts(q) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-[#2c1810] mb-6">Search</h1>

      {/* Search form */}
      <form action="/search" method="GET" className="mb-8">
        <div className="flex gap-2 max-w-xl">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search products, categories, SKU..."
            className="flex-1 px-4 py-2.5 border border-[#e8dfd0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000] text-sm"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#8B0000] text-white rounded-lg text-sm font-medium hover:bg-[#6B0000] transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {q && (
        <>
          <p className="text-sm text-[#2c1810]/60 mb-4">
            {products.length} result{products.length !== 1 ? "s" : ""} for “{q}”
          </p>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    price: Number(product.price),
                    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-[#2c1810]/60">
              <p>No products matched your search.</p>
              <Link href="/products" className="text-[#8B0000] text-sm mt-2 inline-block hover:underline">
                Browse all products →
              </Link>
            </div>
          )}
        </>
      )}

      {!q && (
        <p className="text-[#2c1810]/60 text-sm">Enter a search term above to find products.</p>
      )}
    </div>
  );
}
