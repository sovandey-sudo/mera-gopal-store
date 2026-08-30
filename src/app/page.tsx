{/* Hero */}
<section
  className="relative w-full min-h-[720px] md:min-h-[800px] overflow-hidden text-white"
  style={{
    backgroundImage: "url('/images/mera-gopal-hero.png')",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
  }}
>
  {/* Dark overlay for readable text */}
  <div className="absolute inset-0 bg-black/45" />

  {/* Hero content */}
  <div className="relative z-10 flex min-h-[720px] md:min-h-[800px] items-center justify-center px-4 sm:px-6">
    <div className="w-full max-w-4xl text-center">

      {/* Tagline */}
      <p className="mb-4 text-sm md:text-base font-semibold tracking-[0.35em] uppercase text-[#D4AF37]">
        {siteConfig.tagline}
      </p>

      {/* Store name */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tight text-white drop-shadow-lg">
        Mera Gopal
      </h1>

      {/* Main heading */}
      <h2 className="mt-3 text-4xl sm:text-5xl md:text-6xl font-semibold text-[#D4AF37] drop-shadow-lg">
        Shop with Devotion
      </h2>

      {/* Description */}
      <p className="mx-auto mt-6 max-w-3xl text-base sm:text-lg md:text-xl leading-relaxed text-white drop-shadow-md">
        Discover beautiful Laddu Gopal collections, Radha Rani attire,
        puja essentials, malas, gemstones and devotional treasures
        for your daily seva.
      </p>

      {/* Buttons */}
      <div className="mt-9 flex flex-col sm:flex-row justify-center gap-4">

        <Link href="/products">
          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto bg-[#D4AF37] text-black hover:bg-[#E5C65A]"
          >
            Explore Collection
          </Button>
        </Link>

        <Link href="/search">
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-[#8B0000]"
          >
            Search Products
          </Button>
        </Link>

      </div>

      {/* Quick links */}
      <div className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-3 text-sm md:text-base">

        <Link
          href="/categories/laddu-gopal"
          className="text-white underline underline-offset-4 hover:text-[#D4AF37]"
        >
          Laddu Gopal
        </Link>

        <span className="text-white/60">·</span>

        <Link
          href="/categories/radha-rani"
          className="text-white underline underline-offset-4 hover:text-[#D4AF37]"
        >
          Radha Rani
        </Link>

        <span className="text-white/60">·</span>

        <Link
          href="/categories/gemstones"
          className="text-white underline underline-offset-4 hover:text-[#D4AF37]"
        >
          Gemstones
        </Link>

        <span className="text-white/60">·</span>

        <Link
          href="/kundli"
          className="text-white underline underline-offset-4 hover:text-[#D4AF37]"
        >
          Kundli
        </Link>

      </div>

    </div>
  </div>
</section>
