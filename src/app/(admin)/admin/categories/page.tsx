import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AdminCategoriesPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#2c1810]">Categories</h2>
        <p className="text-sm text-[#2c1810]/60">
          {categories.length} categories · Full create/edit UI can be expanded later
        </p>
      </div>

      <div className="bg-white border border-[#e8dfd0] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#f5f0e8] text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-[#2c1810]/70">Name</th>
              <th className="px-4 py-3 font-medium text-[#2c1810]/70">Slug</th>
              <th className="px-4 py-3 font-medium text-[#2c1810]/70">Products</th>
              <th className="px-4 py-3 font-medium text-[#2c1810]/70">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8dfd0]">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-[#faf7f2]">
                <td className="px-4 py-3 font-medium text-[#2c1810]">{c.name}</td>
                <td className="px-4 py-3 text-[#2c1810]/60">{c.slug}</td>
                <td className="px-4 py-3">{c._count.products}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                      c.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {c.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
