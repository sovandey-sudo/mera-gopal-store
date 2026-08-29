"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface Props {
  productId: string;
  name: string;
  price: number;
  slug: string;
  disabled?: boolean;
  showBuyNow?: boolean;
}

export function AddToCartButton({
  productId,
  name,
  price,
  slug,
  disabled,
  showBuyNow = true,
}: Props) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function writeCart(quantity: number) {
    const existing = localStorage.getItem("cart");
    const cart = existing ? JSON.parse(existing) : [];
    const idx = cart.findIndex((item: { productId: string }) => item.productId === productId);
    if (idx >= 0) {
      cart[idx].quantity += quantity;
    } else {
      cart.push({ productId, name, price, slug, quantity });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
  }

  function handleAdd() {
    if (disabled) return;
    try {
      writeCart(qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (e) {
      console.error("Failed to add to cart", e);
    }
  }

  function handleBuyNow() {
    if (disabled) return;
    try {
      writeCart(qty);
      router.push("/cart");
    } catch (e) {
      console.error("Failed to add to cart", e);
    }
  }

  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center gap-3">
        <span className="text-sm text-[#2c1810]/70">Qty</span>
        <div className="flex items-center border border-[#e8dfd0] rounded-lg overflow-hidden">
          <button
            type="button"
            className="px-3 py-1.5 text-sm hover:bg-[#f5f0e8]"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="px-3 py-1.5 text-sm min-w-[2rem] text-center">{qty}</span>
          <button
            type="button"
            className="px-3 py-1.5 text-sm hover:bg-[#f5f0e8]"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button size="lg" className="flex-1" onClick={handleAdd} disabled={disabled || added}>
          {added ? "Added ✓" : "Add to Cart"}
        </Button>
        {showBuyNow && (
          <Button
            size="lg"
            variant="outline"
            className="flex-1"
            onClick={handleBuyNow}
            disabled={disabled}
          >
            Buy Now
          </Button>
        )}
      </div>
    </div>
  );
}
