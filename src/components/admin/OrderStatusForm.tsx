"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
  "REFUNDED",
] as const;

interface Props {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusForm({ orderId, currentStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(next: string) {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Update failed");
        setLoading(false);
        return;
      }
      setStatus(next);
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <select
        value={status}
        disabled={loading}
        onChange={(e) => handleChange(e.target.value)}
        className="text-xs border border-[#e8dfd0] rounded px-2 py-1 bg-white"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600 mt-0.5">{error}</p>}
    </div>
  );
}
