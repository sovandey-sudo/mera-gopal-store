"use client";

import { useEffect, useState, useCallback } from "react";
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

interface ServerLine {
  productId: string;
  name: string;
  slug: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  isBundleEligible: boolean;
  stockQuantity: number;
}

interface BundleInfo {
  eligibleQuantity: number;
  minimumRequired: number;
  remainingToUnlock: number;
  unlocked: boolean;
  discountAmount: number;
  message: string | null;
  offerName: string | null;
}

interface CartResult {
  lines: ServerLine[];
  subtotal: number;
  bundle: BundleInfo;
  shippingFee: number;
  total: number;
  errors: string[];
}

export default function CartPage() {
  const [localItems, setLocalItems] = useState<LocalCartItem[]>([]);
  const [result, setResult] = useState<CartResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      setLocalItems(raw ? JSON.parse(raw) : []);
    } catch {
      setLocalItems([]);
    }
  }, []);

  // Recalculate on server whenever local items change
  const recalculate = useCallback(async (items: LocalCartItem[]) => {
    if (items.length === 0) {
      setResult(null);
      setLoading(false);
      return;
    }

    setCalculating(true);
    try {
      const res = await fetch("/api/cart/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      });

      if (res.ok) {
        const data: CartResult = await res.json();
        setResult(data);
      }
    } catch (e) {
      console.error("Calculate failed", e);
    } finally {
      setCalculating(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    recalculate(localItems);
  }, [localItems, recalculate]);

  function persist(items: LocalCartItem[]) {
    setLocalItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
    window.dispatchEvent(new Event("cart-updated"));
  }

  function changeQuantity(productId: string, delta: number) {
    const updated = localItems
      .map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      )
      .filter((item) => item.quantity > 0);
    persist(updated);
  }

  function removeItem(productId: string) {
    persist(localItems.filter((item) => item.productId !== productId));
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-[#2c1810]/60">
        Loading cart...
      </div>
    );
  }

  const lines = result?.lines ?? [];
  const bundle = result?.bundle;
  const errors = result?.errors ?? [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-[#2c1810] mb-6">
        Your Cart
        {calculating && (
          <span className="ml-2 text-sm font-normal text-[#2c1810]/50">
            updating...
          </span>
        )}
      </h1>

      {/* Server errors (stock etc.) */}
      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          <ul className="list-disc list-inside space-y-1">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {lines.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[#2c1810]/60 mb-4">Your cart is empty</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Bundle progress — from server */}
          {bundle && (
            <div
              className={`rounded-xl p-4 mb-6 border ${
                bundle.unlocked
                  ? "bg-green-50 border-green-200"
                  : "bg-[#D4AF37]/15 border-[#D4AF37]/40"
              }`}
            >
              {bundle.unlocked ? (
                <p className="text-sm font-medium text-green-800">
                  🎉 {bundle.message || `You unlocked ${bundle.offerName || "savings"}!`}
                  {bundle.discountAmount > 0 && (
                    <span className="ml-1">
                      (−{formatPrice(bundle.discountAmount)})
                    </span>
                  )}
                </p>
              ) : (
                <div>
                  <p className="text-sm text-[#2c1810]">
                    {bundle.message ||
                      `Add ${bundle.remainingToUnlock} more eligible item${
                        bundle.remainingToUnlock !== 1 ? "s" : ""
                      } to unlock savings.`}
                  </p>
                  {/* Progress bar */}
                  <div className="mt-2 h-2 bg-white/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#D4AF37] transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          100,
                          (bundle.eligibleQuantity / bundle.minimumRequired) * 100
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-[#2c1810]/60 mt-1">
                    {bundle.eligibleQuantity} / {bundle.minimumRequired} eligible items
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Items — prices from server */}
          <ul className="space-y-4 mb-8">
            {lines.map((line) => (
              <li
                key={line.productId}
                className="flex gap-4 bg-white border border-[#e8dfd0] rounded-xl p-4"
              >
                <div className="w-20 h-20 bg-[#f5f0e8] rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  🪔
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${line.slug}`}
                    className="font-medium text-[#2c1810] hover:text-[#8B0000] line-clamp-2"
                  >
                    {line.name}
                  </Link>
                  <p className="text-sm text-[#8B0000] font-semibold mt-1">
                    {formatPrice(line.unitPrice)}
                    {!line.isBundleEligible && (
                      <span className="ml-2 text-xs font-normal text-[#2c1810]/50">
                        (not eligible for bundle)
                      </span>
                    )}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-[#e8dfd0] rounded-lg">
                      <button
                        onClick={() => changeQuantity(line.productId, -1)}
                        className="w-8 h-8 flex items-center justify-center text-[#2c1810]/70 hover:bg-[#f5f0e8]"
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm">{line.quantity}</span>
                      <button
                        onClick={() => changeQuantity(line.productId, 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#2c1810]/70 hover:bg-[#f5f0e8]"
                        aria-label="Increase"
                        disabled={line.quantity >= line.stockQuantity}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(line.productId)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right font-medium text-[#2c1810]">
                  {formatPrice(line.lineTotal)}
                </div>
              </li>
            ))}
          </ul>

          {/* Summary — all from server */}
          <div className="bg-white border border-[#e8dfd0] rounded-xl p-5">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#2c1810]/70">Subtotal</span>
                <span>{formatPrice(result?.subtotal ?? 0)}</span>
              </div>
              {bundle && bundle.discountAmount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Bundle savings</span>
                  <span>−{formatPrice(bundle.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-[#2c1810]/60">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t border-[#e8dfd0] pt-2 mt-2 flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-[#8B0000]">
                  {formatPrice(result?.total ?? 0)}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#2c1810]/50 mt-3">
              All prices and discounts are calculated securely on the server.
              Client-side values are never trusted.
            </p>

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <Link href="/products" className="flex-1">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/checkout" className="flex-1">
                <Button className="w-full">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
