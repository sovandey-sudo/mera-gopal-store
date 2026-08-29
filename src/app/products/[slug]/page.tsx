import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPrice, formatDiscount } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/store/ProductCard";
import Link from "next/link";
import { AddToCartButton } from "@/components/store/AddToCartButton";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  try {
    return await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        category: true,
      },
    });
  } catch {
    return null;
  }
}

async function getRelated(categoryId: string, currentId: string) {
  try {
    return await prisma.product.findMany({
      where: {
        categoryId,
        isActive: true,
        id: { not: currentId },
      },
      include: { images: { where: { isPrimary: true }, take: 1 } },
      take: 4,
    });
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.shortDescription || undefined,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const related = await getRelated(product.categoryId, product.id);
  const price = Number(product.price);
  const compareAt = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const discount = formatDiscount(compareAt, price);
  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= product.lowStockThreshold;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-[#2c1810]/60 mb-6 flex flex-wrap gap-1">
        <Link href="/" className="hover:text-[#8B0000]">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[#8B0000]">Products</Link>
        <span>/</span>
        <Link href={`/categories/${product.category.slug}`} className="hover:text-[#8B0000]">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-[#2c1810]">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square bg-[#f5f0e8] rounded-xl overflow-hidden border border-[#e8dfd0] relative">
            {product.images.length > 0 && product.images[0].imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images.find((i) => i.isPrimary)?.imageUrl || product.images[0].imageUrl}
                alt={product.images[0].altText || product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[#8B0000]/30">
                <span className="text-6xl">🪔</span>
                <span className="text-xs mt-2 text-[#2c1810]/40">Photo coming soon</span>
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {product.images.map((img) => (
                <div
                  key={img.id}
                  className="w-16 h-16 bg-[#f5f0e8] rounded-lg border border-[#e8dfd0] flex-shrink-0 overflow-hidden"
                >
                  {img.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img.imageUrl} alt={img.altText || ""} className="w-full h-full object-cover" />
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-sm text-[#8B0000] font-medium mb-1">{product.category.name}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-[#2c1810] mb-3">{product.name}</h1>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-2xl font-bold text-[#8B0000]">{formatPrice(price)}</span>
            {compareAt && compareAt > price && (
              <>
                <span className="text-lg text-[#2c1810]/50 line-through">{formatPrice(compareAt)}</span>
                {discount && (
                  <span className="text-sm font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                    {discount}% OFF
                  </span>
                )}
              </>
            )}
          </div>

          {/* Stock status */}
          <div className="mb-4">
            {isOutOfStock ? (
              <span className="text-sm font-medium text-red-600">Out of Stock</span>
            ) : isLowStock ? (
              <span className="text-sm font-medium text-amber-600">Only {product.stockQuantity} left</span>
            ) : (
              <span className="text-sm font-medium text-green-700">In Stock</span>
            )}
          </div>

          {product.shortDescription && (
            <p className="text-[#2c1810]/80 mb-6">{product.shortDescription}</p>
          )}

          {/* Certificate notice for gemstones */}
          {product.certificateAvailable && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 text-sm">
              <p className="font-medium text-amber-900">Optional Certificate Available</p>
              <p className="text-amber-800 mt-1">
                Certificate fee: {product.certificateFee ? formatPrice(Number(product.certificateFee)) : "Contact us"}
              </p>
              {product.certificateDisclosure && (
                <p className="text-amber-700/80 text-xs mt-2">{product.certificateDisclosure}</p>
              )}
            </div>
          )}

          {/* Add to cart */}
          <div className="mb-8">
            <AddToCartButton
              productId={product.id}
              name={product.name}
              price={price}
              slug={product.slug}
              disabled={isOutOfStock}
            />
          </div>

          {/* Specs */}
          <div className="border-t border-[#e8dfd0] pt-6 space-y-3 text-sm">
            <div className="flex">
              <span className="w-32 text-[#2c1810]/60">SKU</span>
              <span>{product.sku}</span>
            </div>
            {product.weight && (
              <div className="flex">
                <span className="w-32 text-[#2c1810]/60">Weight</span>
                <span>{Number(product.weight)} {product.productType === "gemstone" ? "carat" : "g"}</span>
              </div>
            )}
            {product.productType && (
              <div className="flex">
                <span className="w-32 text-[#2c1810]/60">Type</span>
                <span className="capitalize">{product.productType}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full description */}
      {product.fullDescription && (
        <div className="mt-12 border-t border-[#e8dfd0] pt-8">
          <h2 className="text-xl font-bold text-[#2c1810] mb-4">Product Description</h2>
          <div className="prose prose-sm max-w-none text-[#2c1810]/80 whitespace-pre-line">
            {product.fullDescription}
          </div>
        </div>
      )}

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-12 border-t border-[#e8dfd0] pt-8">
          <h2 className="text-xl font-bold text-[#2c1810] mb-6">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  ...p,
                  price: Number(p.price),
                  compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
