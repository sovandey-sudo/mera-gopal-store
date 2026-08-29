import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/store/ProductCard";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getCategory(slug: string) {
  try {
    return await prisma.category.findUnique({
      where: { slug, isActive: true },
    });
  } catch {
    return null;
  }
}

async function getProducts(categoryId: string) {
  try {
    return await prisma.product.findMany({
      where: { categoryId, isActive: true },
      include: { images: { where: { isPrimary: true }, take: 1 } },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return { title: "Category Not Found" };
  return {
    title: category.name,
    description: category.description || `Shop ${category.name} products`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  const products = await getProducts(category.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <nav className="text-sm text-[#2c1810]/60 mb-4 flex gap-1">
        <Link href="/" className="hover:text-[#8B0000]">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[#8B0000]">Products</Link>
        <span>/</span>
        <span className="text-[#2c1810]">{category.name}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#2c1810]">{category.name}</h1>
        {category.description && (
          <p className="text-[#2c1810]/70 mt-2 max-w-2xl">{category.description}</p>
        )}
        <p className="text-sm text-[#2c1810]/50 mt-1">
          {products.length} product{products.length !== 1 ? "s" : ""}
        </p>
      </div>

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
        <div className="text-center py-16 text-[#2c1810]/60">
          <p>No products in this category yet.</p>
        </div>
      )}
    </div>
  );
}
