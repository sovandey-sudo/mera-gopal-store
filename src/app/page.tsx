{/* =========================================================
    HERO - FULL WIDTH LADDU GOPAL IMAGE
========================================================== */}
<section className="relative w-full min-h-[620px] sm:min-h-[680px] lg:min-h-[720px] overflow-hidden bg-black text-white">

  {/* Full-width background image */}
  <img
    src="/images/laddu-gopal-hero.png"
    alt="Laddu Gopal - Mera Gopal"
    className="absolute inset-0 block w-full h-full object-cover object-center"
  />

  {/* Dark overlay */}
  <div className="absolute inset-0 bg-black/45" />

  {/* Additional readability gradient */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/65" />

  {/* Content */}
  <div className="relative z-10 w-full min-h-[620px] sm:min-h-[680px] lg:min-h-[720px] flex items-center justify-center px-4 sm:px-6">

    <div className="w-full max-w-4xl mx-auto text-center">

      <p className="text-[#D4AF37] font-semibold text-sm sm:text-base tracking-[0.25em] uppercase mb-5 drop-shadow-lg">
        Divine Essentials for Daily Seva
      </p>

      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-4 drop-shadow-2xl">
        Mera Gopal
      </h1>

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#D4AF37] mb-6 drop-shadow-xl">
        Shop with Devotion
      </h2>

      <p className="text-white text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto mb-9 drop-shadow-lg">
        Discover beautiful Laddu Gopal collections, Radha Rani attire,
        puja essentials, malas, gemstones and devotional treasures
        for your daily seva.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">

        <Link href="/products">
          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto min-w-[190px] shadow-xl"
          >
            Explore Collection
          </Button>
        </Link>

        <Link href="/search">
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto min-w-[190px] border-2 border-white text-white hover:bg-white hover:text-[#8B0000] shadow-xl"
          >
            Search Products
          </Button>
        </Link>

      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center text-sm sm:text-base">

        <Link
          href="/categories/laddu-gopal"
          className="text-white hover:text-[#D4AF37] underline underline-offset-4 transition-colors drop-shadow-lg"
        >
          Laddu Gopal
        </Link>

        <span className="text-white/60">·</span>

        <Link
          href="/categories/radha-rani"
          className="text-white hover:text-[#D4AF37] underline underline-offset-4 transition-colors drop-shadow-lg"
        >
          Radha Rani
        </Link>

        <span className="text-white/60">·</span>

        <Link
          href="/categories/gemstones"
          className="text-white hover:text-[#D4AF37] underline underline-offset-4 transition-colors drop-shadow-lg"
        >
          Gemstones
        </Link>

        <span className="text-white/60">·</span>

        <Link
          href="/kundli"
          className="text-white hover:text-[#D4AF37] underline underline-offset-4 transition-colors drop-shadow-lg"
        >
          Kundli
        </Link>

      </div>

    </div>
  </div>
</section>
