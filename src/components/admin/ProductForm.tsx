"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface Category {
  id: string;
  name: string;
}

interface ProductData {
  id?: string;
  sku: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  categoryId: string;
  price: string;
  compareAtPrice: string;
  stockQuantity: string;
  lowStockThreshold: string;
  isActive: boolean;
  isFeatured: boolean;
  isBundleEligible: boolean;
  productType: string;
  certificateAvailable: boolean;
  certificateFee: string;
  weight: string;
  seoTitle: string;
  seoDescription: string;
}

interface Props {
  categories: Category[];
  initialData?: ProductData;
  mode: "create" | "edit";
}

const defaultData: ProductData = {
  sku: "",
  name: "",
  slug: "",
  shortDescription: "",
  fullDescription: "",
  categoryId: "",
  price: "",
  compareAtPrice: "",
  stockQuantity: "0",
  lowStockThreshold: "5",
  isActive: true,
  isFeatured: false,
  isBundleEligible: true,
  productType: "physical",
  certificateAvailable: false,
  certificateFee: "",
  weight: "",
  seoTitle: "",
  seoDescription: "",
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProductForm({ categories, initialData, mode }: Props) {
  const router = useRouter();
  const [data, setData] = useState<ProductData>(initialData || defaultData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(field: keyof ProductData, value: string | boolean) {
    setData((prev) => {
      const next = { ...prev, [field]: value };
      // Auto-generate slug from name when creating
      if (field === "name" && mode === "create" && typeof value === "string") {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url =
        mode === "create"
          ? "/api/admin/products"
          : `/api/admin/products/${data.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Basic info */}
      <section className="bg-white border border-[#e8dfd0] rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-[#2c1810]">Basic Information</h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              required
              value={data.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SKU *</label>
            <input
              required
              value={data.sku}
              onChange={(e) => update("sku", e.target.value)}
              className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug *</label>
          <input
            required
            value={data.slug}
            onChange={(e) => update("slug", e.target.value)}
            className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <select
            required
            value={data.categoryId}
            onChange={(e) => update("categoryId", e.target.value)}
            className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000] outline-none"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Short Description</label>
          <textarea
            value={data.shortDescription}
            onChange={(e) => update("shortDescription", e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Full Description</label>
          <textarea
            value={data.fullDescription}
            onChange={(e) => update("fullDescription", e.target.value)}
            rows={5}
            className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000] outline-none"
          />
        </div>
      </section>

      {/* Pricing & Inventory */}
      <section className="bg-white border border-[#e8dfd0] rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-[#2c1810]">Pricing & Inventory</h3>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price (₹) *</label>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={data.price}
              onChange={(e) => update("price", e.target.value)}
              className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Compare at Price</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={data.compareAtPrice}
              onChange={(e) => update("compareAtPrice", e.target.value)}
              className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock Quantity *</label>
            <input
              required
              type="number"
              min="0"
              value={data.stockQuantity}
              onChange={(e) => update("stockQuantity", e.target.value)}
              className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000] outline-none"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Low Stock Threshold</label>
            <input
              type="number"
              min="0"
              value={data.lowStockThreshold}
              onChange={(e) => update("lowStockThreshold", e.target.value)}
              className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Weight (g / carat)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={data.weight}
              onChange={(e) => update("weight", e.target.value)}
              className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000] outline-none"
            />
          </div>
        </div>
      </section>

      {/* Flags & Type */}
      <section className="bg-white border border-[#e8dfd0] rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-[#2c1810]">Options</h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product Type</label>
            <select
              value={data.productType}
              onChange={(e) => update("productType", e.target.value)}
              className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000] outline-none"
            >
              <option value="physical">Physical</option>
              <option value="gemstone">Gemstone</option>
              <option value="service">Service</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {[
            { key: "isActive" as const, label: "Active" },
            { key: "isFeatured" as const, label: "Featured" },
            { key: "isBundleEligible" as const, label: "Bundle Eligible" },
            { key: "certificateAvailable" as const, label: "Certificate Available" },
          ].map((opt) => (
            <label key={opt.key} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={data[opt.key] as boolean}
                onChange={(e) => update(opt.key, e.target.checked)}
                className="rounded border-[#e8dfd0] text-[#8B0000] focus:ring-[#8B0000]"
              />
              {opt.label}
            </label>
          ))}
        </div>

        {data.certificateAvailable && (
          <div>
            <label className="block text-sm font-medium mb-1">Certificate Fee (₹)</label>
            <input
              type="number"
              min="0"
              value={data.certificateFee}
              onChange={(e) => update("certificateFee", e.target.value)}
              className="w-full max-w-xs px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000] outline-none"
            />
          </div>
        )}
      </section>

      {/* SEO */}
      <section className="bg-white border border-[#e8dfd0] rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-[#2c1810]">SEO (optional)</h3>
        <div>
          <label className="block text-sm font-medium mb-1">SEO Title</label>
          <input
            value={data.seoTitle}
            onChange={(e) => update("seoTitle", e.target.value)}
            className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000] outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">SEO Description</label>
          <textarea
            value={data.seoDescription}
            onChange={(e) => update("seoDescription", e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000] outline-none"
          />
        </div>
      </section>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : mode === "create" ? "Create Product" : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
