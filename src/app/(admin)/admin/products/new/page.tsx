import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <h2 className="text-xl font-bold text-[#2c1810] mb-6">Add New Product</h2>
      <ProductForm categories={categories} mode="create" />
    </div>
  );
}
