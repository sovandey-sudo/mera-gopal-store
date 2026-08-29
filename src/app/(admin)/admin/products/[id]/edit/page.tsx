import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductImageUpload } from "@/components/admin/ProductImageUpload";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h2 className="text-xl font-bold text-[#2c1810] mb-6">Edit Product</h2>
      <div className="mb-6">
        <ProductImageUpload productId={product.id} />
      </div>
      <ProductForm
        categories={categories}
        mode="edit"
        initialData={{
          id: product.id,
          sku: product.sku,
          name: product.name,
          slug: product.slug,
          shortDescription: product.shortDescription || "",
          fullDescription: product.fullDescription || "",
          categoryId: product.categoryId,
          price: String(product.price),
          compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
          stockQuantity: String(product.stockQuantity),
          lowStockThreshold: String(product.lowStockThreshold),
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          isBundleEligible: product.isBundleEligible,
          productType: product.productType,
          certificateAvailable: product.certificateAvailable,
          certificateFee: product.certificateFee ? String(product.certificateFee) : "",
          weight: product.weight ? String(product.weight) : "",
          seoTitle: product.seoTitle || "",
          seoDescription: product.seoDescription || "",
        }}
      />
    </div>
  );
}
