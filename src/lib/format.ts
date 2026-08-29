export function formatPrice(amount: number | string | { toString(): string }): string {
  const num = typeof amount === "number" ? amount : Number(amount);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDiscount(compareAt: number | null | undefined, price: number): number | null {
  if (!compareAt || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}
