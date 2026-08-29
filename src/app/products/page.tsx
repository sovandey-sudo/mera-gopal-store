import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/store/ProductCard";
import Link from "next/link";

export const metadata = {
  title: "All Products",
  description: "Browse our complete collection of devotional products, gemstones, malas and more.",
};

interface SearchParams {
  category?: string;
  sort?: string;
  q?: string;
}

async function getProducts(searchParams: SearchParams) {
  try {
    const where: any = { isActive: true };

    if (searchParams.category) {
      where.category = { slug: searchParams.category };
    }

    if (searchParams.q) {
      where.OR = [
        { name: { contains: searchParams.q, mode: "insensitive" } },
        { shortDescription: { contains: searchParams.q, mode: "insensitive" } },
        { sku: { contains: searchParams.q, mode: "insensitive" } },
      ];
    }

    let orderBy: any = { createdAt: "desc" };
    if (searchParams.sort === "price-asc") orderBy = { price: "asc" };
    if (searchParams.sort === "price-desc") orderBy = { price: "desc" };
    if (searchParams.sort === "name") orderBy = { name: "asc" };

    return await prisma.product.findMany({
      where,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: true,
      },
      orderBy,
      take: 48,
    });
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });
  } catch {
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#2c1810]">All Products</h1>
        <p className="text-sm text-[#2c1810]/60 mt-1">
          {products.length} product{products.length !== 1 ? "s" : ""} available
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <aside className="lg:w-56 flex-shrink-0">
          <div className="bg-white border border-[#e8dfd0] rounded-xl p-4 sticky top-24">
            <h2 className="font-semibold text-[#2c1810] mb-3 text-sm">Categories</h2>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/products"
                  className={`block text-sm py-1 ${!params.category ? "text-[#8B0000] font-medium" : "text-[#2c1810]/70 hover:text-[#8B0000]"}`}
                >
                  All
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className={`block text-sm py-1 ${params.category === cat.slug ? "text-[#8B0000] font-medium" : "text-[#2c1810]/70 hover:text-[#8B0000]"}`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="font-semibold text-[#2c1810] mt-6 mb-3 text-sm">Sort by</h2>
            <ul className="space-y-1.5">
              {[
                { value: "", label: "Newest" },
                { value: "price-asc", label: "Price: Low to High" },
                { value: "price-desc", label: "Price: High to Low" },
                { value: "name", label: "Name" },
              ].map((opt) => (
                <li key={opt.value}>
                  <Link
                    href={`/products?${new URLSearchParams({
                      ...(params.category ? { category: params.category } : {}),
                      ...(opt.value ? { sort: opt.value } : {}),
                    }).toString()}`}
                    className={`block text-sm py-1 ${ (params.sort || "") === opt.value ? "text-[#8B0000] font-medium" : "text-[#2c1810]/70 hover:text-[#8B0000]"}`}
                  >
                    {opt.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
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
            <div className="text-center py-16 text-[#2c1810]/60">
              <p className="text-lg mb-2">No products found</p>
              <p className="text-sm">Try a different category or run the database seed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
