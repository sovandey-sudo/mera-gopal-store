import { prisma } from "@/lib/prisma";
import { DiscountType } from "@prisma/client";

export interface CartLineInput {
  productId: string;
  quantity: number;
}

export interface CalculatedLine {
  productId: string;
  name: string;
  slug: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  isBundleEligible: boolean;
  stockQuantity: number;
  isActive: boolean;
}

export interface BundleResult {
  offerId: string | null;
  offerName: string | null;
  eligibleQuantity: number;
  minimumRequired: number;
  remainingToUnlock: number;
  unlocked: boolean;
  discountType: DiscountType | null;
  discountValue: number;
  discountAmount: number;
  message: string | null;
}

export interface CartCalculation {
  lines: CalculatedLine[];
  subtotal: number;
  bundle: BundleResult;
  shippingFee: number;
  total: number;
  errors: string[];
  /** True when any requested qty exceeds available stock (checkout must reject) */
  hasStockErrors: boolean;
}

function emptyCart(): CartCalculation {
  return {
    lines: [],
    subtotal: 0,
    bundle: {
      offerId: null,
      offerName: null,
      eligibleQuantity: 0,
      minimumRequired: 0,
      remainingToUnlock: 0,
      unlocked: false,
      discountType: null,
      discountValue: 0,
      discountAmount: 0,
      message: null,
    },
    shippingFee: 0,
    total: 0,
    errors: [],
    hasStockErrors: false,
  };
}

/**
 * Server-side authoritative cart calculation.
 * NEVER trust client-sent prices or discounts.
 * Over-quantity requests are REJECTED (not silently reduced).
 */
export async function calculateCart(
  items: CartLineInput[]
): Promise<CartCalculation> {
  const errors: string[] = [];
  let hasStockErrors = false;

  if (!items.length) {
    return emptyCart();
  }

  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      name: true,
      slug: true,
      sku: true,
      price: true,
      stockQuantity: true,
      isActive: true,
      isBundleEligible: true,
    },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));
  const lines: CalculatedLine[] = [];

  for (const item of items) {
    const product = productMap.get(item.productId);

    if (!product) {
      errors.push(`Product not found`);
      continue;
    }

    if (!product.isActive) {
      errors.push(`"${product.name}" is no longer available`);
      continue;
    }

    const qty = Math.max(0, Math.floor(item.quantity));
    if (qty <= 0) {
      errors.push(`Invalid quantity for "${product.name}"`);
      continue;
    }

    // REJECT over-quantity — do not silently clamp
    if (qty > product.stockQuantity) {
      hasStockErrors = true;
      errors.push(
        `"${product.name}" — only ${product.stockQuantity} available (requested ${qty})`
      );
      continue;
    }

    const unitPrice = Number(product.price);

    lines.push({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      unitPrice,
      quantity: qty,
      lineTotal: unitPrice * qty,
      isBundleEligible: product.isBundleEligible,
      stockQuantity: product.stockQuantity,
      isActive: product.isActive,
    });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);

  // Active bundle offer
  const now = new Date();
  const offer = await prisma.bundleOffer.findFirst({
    where: {
      isActive: true,
      OR: [{ startDate: null }, { startDate: { lte: now } }],
      AND: [{ OR: [{ endDate: null }, { endDate: { gte: now } }] }],
    },
    orderBy: { createdAt: "desc" },
  });

  let bundle: BundleResult = {
    offerId: null,
    offerName: null,
    eligibleQuantity: 0,
    minimumRequired: 0,
    remainingToUnlock: 0,
    unlocked: false,
    discountType: null,
    discountValue: 0,
    discountAmount: 0,
    message: null,
  };

  if (offer) {
    const eligibleQuantity = lines
      .filter((l) => l.isBundleEligible)
      .reduce((sum, l) => sum + l.quantity, 0);

    const minimumRequired = offer.minimumQuantity;
    const unlocked = eligibleQuantity >= minimumRequired;
    const remainingToUnlock = Math.max(0, minimumRequired - eligibleQuantity);

    let discountAmount = 0;
    if (unlocked) {
      if (offer.discountType === DiscountType.PERCENTAGE) {
        discountAmount =
          Math.round(subtotal * (Number(offer.discountValue) / 100) * 100) / 100;
      } else {
        discountAmount = Math.min(Number(offer.discountValue), subtotal);
      }
    }

    let message: string | null = null;
    if (unlocked) {
      message = `Savings unlocked: ${
        offer.discountType === DiscountType.PERCENTAGE
          ? `${Number(offer.discountValue)}% off`
          : `₹${Number(offer.discountValue)} off`
      }`;
    } else if (eligibleQuantity > 0) {
      message = `Add ${remainingToUnlock} more eligible item${
        remainingToUnlock === 1 ? "" : "s"
      } to unlock savings`;
    } else {
      message = `Add ${minimumRequired} eligible items to unlock transportation savings`;
    }

    bundle = {
      offerId: offer.id,
      offerName: offer.name,
      eligibleQuantity,
      minimumRequired,
      remainingToUnlock,
      unlocked,
      discountType: offer.discountType,
      discountValue: Number(offer.discountValue),
      discountAmount,
      message,
    };
  }

  const shippingFee = 0;
  const total = Math.max(0, subtotal - bundle.discountAmount + shippingFee);

  return {
    lines,
    subtotal,
    bundle,
    shippingFee,
    total,
    errors,
    hasStockErrors,
  };
}
