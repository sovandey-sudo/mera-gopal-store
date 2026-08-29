"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";

interface LocalCartItem {
  productId: string;
  name: string;
  price: number;
  slug: string;
  quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<LocalCartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      const cart = raw ? JSON.parse(raw) : [];
      setItems(cart);
      if (cart.length === 0) {
        // empty cart — redirect
      }
    } catch {
      setItems([]);
    }
  }, []);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
          guestName: form.fullName,
          guestEmail: form.email,
          guestPhone: form.phone,
          shipping: {
            fullName: form.fullName,
            phone: form.phone,
            addressLine1: form.addressLine1,
            addressLine2: form.addressLine2 || undefined,
            city: form.city,
            state: form.state,
            postalCode: form.postalCode,
            country: "India",
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Checkout failed");
        setLoading(false);
        return;
      }

      // Clear local cart
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cart-updated"));

      // Redirect to payment (mock or real)
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        router.push(`/order/${data.orderNumber}?status=success`);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-[#2c1810]/60 mb-4">Your cart is empty</p>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const estimatedSubtotal = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-[#2c1810] mb-6">Checkout</h1>

      {/* Order summary */}
      <div className="bg-white border border-[#e8dfd0] rounded-xl p-4 mb-6">
        <h2 className="font-semibold text-sm text-[#2c1810] mb-3">
          Order Summary ({items.length} item{items.length !== 1 ? "s" : ""})
        </h2>
        <ul className="space-y-2 text-sm">
          {items.map((item) => (
            <li key={item.productId} className="flex justify-between">
              <span className="text-[#2c1810]/80">
                {item.name} × {item.quantity}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-[#e8dfd0] mt-3 pt-3 flex justify-between font-medium">
          <span>Estimated Subtotal</span>
          <span className="text-[#8B0000]">{formatPrice(estimatedSubtotal)}</span>
        </div>
        <p className="text-xs text-[#2c1810]/50 mt-2">
          Final total (including any bundle savings) is calculated securely on the server.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white border border-[#e8dfd0] rounded-xl p-5 space-y-3">
          <h2 className="font-semibold text-[#2c1810]">Contact & Shipping</h2>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Full Name *</label>
              <input
                required
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Phone *</label>
              <input
                required
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Email *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Address Line 1 *</label>
            <input
              required
              value={form.addressLine1}
              onChange={(e) => update("addressLine1", e.target.value)}
              className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Address Line 2</label>
            <input
              value={form.addressLine2}
              onChange={(e) => update("addressLine2", e.target.value)}
              className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm"
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">City *</label>
              <input
                required
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">State *</label>
              <input
                required
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
                className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">PIN Code *</label>
              <input
                required
                value={form.postalCode}
                onChange={(e) => update("postalCode", e.target.value)}
                className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
          <p className="font-medium">Sandbox Payment Mode</p>
          <p className="mt-1 text-amber-800">
            This uses a mock payment provider. No real money is charged. In production this will connect to Razorpay (or another Indian gateway).
          </p>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Placing Order..." : "Place Order & Pay"}
        </Button>

        <p className="text-xs text-center text-[#2c1810]/50">
          By placing the order you agree to our Terms and Privacy Policy.
        </p>
      </form>
    </div>
  );
}
