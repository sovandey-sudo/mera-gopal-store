import Link from "next/link";
import { formatPrice, formatDiscount } from "@/lib/format";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number | { toString(): string };
    compareAtPrice?: number | { toString(): string } | null;
    shortDescription?: string | null;
    stockQuantity?: number;
    certificateAvailable?: boolean;
    images?: { imageUrl: string; altText?: string | null; isPrimary?: boolean }[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const price = Number(product.price);
  const compareAt = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const discount = formatDiscount(compareAt, price);
  const primaryImage =
    product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const outOfStock = (product.stockQuantity ?? 1) <= 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white border border-[#e8dfd0] rounded-xl overflow-hidden hover:border-[#8B0000]/40 hover:shadow-md transition-all"
    >
      <div className="aspect-square bg-[#f5f0e8] relative overflow-hidden">
        {primaryImage?.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={primaryImage.imageUrl}
            alt={primaryImage.altText || product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-[#8B0000]/30">
            🪔
          </div>
        )}
        {discount && (
          <span className="absolute top-2 left-2 bg-[#8B0000] text-white text-xs font-semibold px-2 py-0.5 rounded">
            {discount}% OFF
          </span>
        )}
        {outOfStock && (
          <span className="absolute top-2 right-2 bg-gray-800 text-white text-xs font-semibold px-2 py-0.5 rounded">
            Out of Stock
          </span>
        )}
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="font-medium text-[#2c1810] text-sm sm:text-base line-clamp-2 group-hover:text-[#8B0000] transition-colors">
          {product.name}
        </h3>
        {product.shortDescription && (
          <p className="text-xs text-[#2c1810]/55 mt-1 line-clamp-2">
            {product.shortDescription}
          </p>
        )}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-bold text-[#8B0000]">{formatPrice(price)}</span>
          {compareAt && compareAt > price && (
            <span className="text-xs text-[#2c1810]/45 line-through">
              {formatPrice(compareAt)}
            </span>
          )}
        </div>
        {product.certificateAvailable && (
          <p className="text-[10px] text-amber-700 mt-1">Optional certificate available</p>
        )}
      </div>
    </Link>
  );
}
