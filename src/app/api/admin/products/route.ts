import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const productSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  categoryId: z.string().min(1),
  price: z.string().or(z.number()),
  compareAtPrice: z.string().optional().nullable(),
  stockQuantity: z.string().or(z.number()),
  lowStockThreshold: z.string().or(z.number()).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isBundleEligible: z.boolean().optional(),
  productType: z.string().optional(),
  certificateAvailable: z.boolean().optional(),
  certificateFee: z.string().optional().nullable(),
  weight: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
    }

    const d = parsed.data;

    const product = await prisma.product.create({
      data: {
        sku: d.sku,
        name: d.name,
        slug: d.slug,
        shortDescription: d.shortDescription || null,
        fullDescription: d.fullDescription || null,
        categoryId: d.categoryId,
        price: Number(d.price),
        compareAtPrice: d.compareAtPrice ? Number(d.compareAtPrice) : null,
        stockQuantity: Number(d.stockQuantity),
        lowStockThreshold: d.lowStockThreshold ? Number(d.lowStockThreshold) : 5,
        isActive: d.isActive ?? true,
        isFeatured: d.isFeatured ?? false,
        isBundleEligible: d.isBundleEligible ?? true,
        productType: d.productType || "physical",
        certificateAvailable: d.certificateAvailable ?? false,
        certificateFee: d.certificateFee ? Number(d.certificateFee) : null,
        weight: d.weight ? Number(d.weight) : null,
        seoTitle: d.seoTitle || null,
        seoDescription: d.seoDescription || null,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json({ error: "SKU or slug already exists" }, { status: 409 });
    }
    console.error(e);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
