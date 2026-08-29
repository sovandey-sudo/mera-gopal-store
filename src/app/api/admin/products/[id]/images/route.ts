import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveProductImage } from "@/lib/storage/upload";

/**
 * POST /api/admin/products/[id]/images
 * Admin-only product image upload.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: productId } = await params;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const result = await saveProductImage(file);
    if (!result.success || !result.imageUrl) {
      return NextResponse.json(
        { error: result.error || "Upload failed" },
        { status: 400 }
      );
    }

    const isPrimary = formData.get("isPrimary") === "true";
    const altText = (formData.get("altText") as string) || product.name;

    if (isPrimary) {
      await prisma.productImage.updateMany({
        where: { productId },
        data: { isPrimary: false },
      });
    }

    // If first image, force primary
    const existingCount = await prisma.productImage.count({ where: { productId } });
    const makePrimary = isPrimary || existingCount === 0;

    const image = await prisma.productImage.create({
      data: {
        productId,
        imageUrl: result.imageUrl,
        altText,
        isPrimary: makePrimary,
        displayOrder: existingCount,
      },
    });

    return NextResponse.json({ image }, { status: 201 });
  } catch (e) {
    console.error("Image upload error:", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
