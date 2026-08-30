import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/store/ProductCard";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import { siteConfig } from "@/lib/site";

async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: { images: { where: { isPrimary: true }, take: 1 } },
      take: 8,
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

async function getLatestProducts() {
  try {
    return await prisma.product.findMany({
      where: { isActive: true },
      include: { images: { where: { isPrimary: true }, take: 1 } },
      take: 8,
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      take: 12,
    });
  } catch {
    return [];
  }
}

async function getActiveBundle() {
  try {
    const now = new Date();

    return await prisma.bundleOffer.findFirst({
      where: {
        isActive: true,
        OR: [{ startDate: null }, { startDate: { lte: now } }],
        AND: [
          {
            OR: [{ endDate: null }, { endDate: { gte: now } }],
          },
        ],
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const [featured, latest, categories, bundle] = await Promise.all([
    getFeaturedProducts(),
    getLatestProducts(),
    getCategories(),
    getActiveBundle(),
  ]);

  const savingsLabel =
    bundle && Number(bundle.discountValue) > 0
      ? bundle.discountType === "PERCENTAGE"
        ? `${Number(bundle.discountValue)}% savings`
        : `${formatPrice(Number(bundle.discountValue))} savings`
      : "special savings";

  return (
    <div>
      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="relative overflow-hidden bg-[#8B0000] text-white">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B0000] via-[#720000] to-[#4a0000]" />

        <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-[#D4AF37]/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#D4AF37]/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 items-center min-h-[520px] gap-8 py-12 md:py-16">
            {/* Hero Content */}
            <div className="text-center md:text-left order-2 md:order-1">
              <p className="text-[#D4AF37] font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                {siteConfig.tagline}
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5">
                Shop with
                <span className="block text-[#D4AF37]">
                  Devotion
                </span>
              </h1>

              <p className="text-white/85 text-base sm:text-lg max-w-xl mx-auto md:mx-0 mb-8">
                Discover beautiful Laddu Gopal collections, Radha Rani attire,
                puja essentials, malas, gemstones and devotional treasures
                for your daily seva.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start mb-7">
                <Link href="/products">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Explore Collection
                  </Button>
                </Link>

                <Link href="/search">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-[#8B0000]"
                  >
                    Search Products
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap gap-3 justify-center md:justify-start text-sm">
                <Link
                  href="/categories/laddu-gopal"
                  className="text-white/90 hover:text-[#D4AF37] transition-colors"
                >
                  Laddu Gopal
                </Link>

                <span className="text-white/40">·</span>

                <Link
                  href="/categories/radha-rani"
                  className="text-white/90 hover:text-[#D4AF37] transition-colors"
                >
                  Radha Rani
                </Link>

                <span className="text-white/40">·</span>

                <Link
                  href="/categories/gemstones"
                  className="text-white/90 hover:text-[#D4AF37] transition-colors"
                >
                  Gemstones
                </Link>

                <span className="text-white/40">·</span>

                <Link
                  href="/kundli"
                  className="text-white/90 hover:text-[#D4AF37] transition-colors"
                >
                  Kundli
                </Link>
              </div>
            </div>

            {/* Laddu Gopal Hero Image */}
            <div className="relative order-1 md:order-2 flex justify-center items-center">
              <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#D4AF37]/15 blur-2xl" />

              <div className="relative w-full max-w-[520px]">
                <img
                  src="/images/laddu-gopal-hero.png"
                  alt="Laddu Gopal - Mera Gopal"
                  className="w-full h-auto object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CATEGORIES
      ========================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-[#2c1810]">
            Shop by Category
          </h2>

          <Link
            href="/products"
            className="text-sm text-[#8B0000] hover:underline"
          >
            View all
          </Link>
        </div>

        {categories.length === 0 ? (
          <p className="text-sm text-[#2c1810]/50">
            Categories will appear after seeding.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="bg-white border border-[#e8dfd0] rounded-xl p-4 text-center hover:border-[#8B0000]/40 transition-colors"
              >
                <p className="text-sm font-medium text-[#2c1810]">
                  {cat.name}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* =========================================================
          FEATURED PRODUCTS
      ========================================================== */}
      <section className="bg-[#f5f0e8]/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl md:text-2xl font-bold text-[#2c1810] mb-6">
            Featured Products
          </h2>

          {featured.length === 0 ? (
            <p className="text-sm text-[#2c1810]/50">
              No featured products yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          LATEST ARRIVALS
      ========================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-xl md:text-2xl font-bold text-[#2c1810] mb-6">
          Latest Arrivals
        </h2>

        {latest.length === 0 ? (
          <p className="text-sm text-[#2c1810]/50">
            No products yet. Run the database seed.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {latest.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* =========================================================
          BUNDLE OFFER
      ========================================================== */}
      {bundle && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
          <div className="bg-gradient-to-r from-[#8B0000] to-[#6B0000] rounded-2xl p-6 sm:p-8 text-white">
            <h2 className="text-xl font-bold mb-2">
              {bundle.name}
            </h2>

            <p className="text-white/85 text-sm mb-4 max-w-2xl">
              {bundle.message ||
                `Order ${bundle.minimumQuantity} or more eligible items in one checkout to unlock ${savingsLabel}. Eligibility and amounts are configured by Admin and calculated on the server.`}
            </p>

            <p className="text-xs text-white/70 mb-4">
              Minimum eligible quantity: {bundle.minimumQuantity} · Discount:{" "}
              {savingsLabel}
            </p>

            <Link href="/products">
              <Button variant="secondary" size="md">
                Shop eligible products
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* =========================================================
          GEMSTONES + KUNDLI
      ========================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 grid md:grid-cols-2 gap-4">
        {/* Gemstones */}
        <div className="bg-white border border-[#e8dfd0] rounded-2xl p-6">
          <h2 className="text-lg font-bold text-[#2c1810] mb-2">
            Gemstones
          </h2>

          <p className="text-sm text-[#2c1810]/70 mb-4">
            Browse gemstones listed by Admin. Certificate fees and disclosures
            appear only when provided. No laboratory numbers are invented by
            this website.
          </p>

          <div className="flex flex-wrap gap-2">
            <Link href="/categories/gemstones">
              <Button size="sm">
                Shop gemstones
              </Button>
            </Link>

            <Link href="/gemstone-prediction">
              <Button size="sm" variant="outline">
                Traditional guide
              </Button>
            </Link>
          </div>
        </div>

        {/* Kundli */}
        <div className="bg-white border border-[#e8dfd0] rounded-2xl p-6">
          <h2 className="text-lg font-bold text-[#2c1810] mb-2">
            Kundli
          </h2>

          <p className="text-sm text-[#2c1810]/70 mb-4">
            Enter birth details to request a chart. The calculation engine is
            under development — we do not invent planetary positions.
          </p>

          <Link href="/kundli">
            <Button size="sm" variant="outline">
              Open Kundli form
            </Button>
          </Link>
        </div>
      </section>

      {/* =========================================================
          TRUST / DISCLOSURE
      ========================================================== */}
      <section className="bg-[#f5f0e8]/60 border-t border-[#e8dfd0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="text-lg font-bold text-[#2c1810] mb-3">
            Important information
          </h2>

          <ul className="text-sm text-[#2c1810]/70 space-y-2 max-w-3xl">
            <li>
              Astrology features are under development and are not a substitute
              for professional advice.
            </li>

            <li>
              Gemstone guidance is traditional in nature and does not guarantee
              health, financial, or spiritual outcomes.
            </li>

            <li>
              Product photographs in development may be placeholders until
              Admin uploads real images.
            </li>

            <li>
              <Link
                href="/disclaimer"
                className="text-[#8B0000] hover:underline"
              >
                Full disclaimer
              </Link>

              {" · "}

              <Link
                href="/policies/privacy"
                className="text-[#8B0000] hover:underline"
              >
                Privacy
              </Link>

              {" · "}

              <Link
                href="/policies/terms"
                className="text-[#8B0000] hover:underline"
              >
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
