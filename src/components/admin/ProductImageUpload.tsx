"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  productId: string;
}

export function ProductImageUpload({ productId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("isPrimary", "true");

      const res = await fetch(`/api/admin/products/${productId}/images`, {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed");
        setLoading(false);
        return;
      }

      setSuccess("Image uploaded");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="bg-white border border-[#e8dfd0] rounded-xl p-5 space-y-3">
      <h3 className="font-semibold text-[#2c1810]">Product Photograph</h3>
      <p className="text-xs text-[#2c1810]/60">
        JPG, PNG, WebP or GIF. Max 5MB. Magic-byte validated. Admin only.
      </p>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        disabled={loading}
        onChange={handleUpload}
        className="text-sm"
      />
      {loading && <p className="text-xs text-[#2c1810]/50">Uploading...</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
      {success && <p className="text-xs text-green-700">{success}</p>}
    </div>
  );
}
