{/* Hero */}
<section
  className="relative w-full min-h-[720px] md:min-h-[760px] overflow-hidden bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: "url('/images/laddu-gopal-hero.png')",
  }}
>
  {/* Full-width dark overlay */}
  <div className="absolute inset-0 bg-black/55" />

  {/* Hero content */}
  <div className="relative z-10 min-h-[720px] md:min-h-[760px] w-full flex items-center justify-center px-4 sm:px-6">
    <div className="w-full max-w-4xl mx-auto text-center text-white">

      {/* Tagline */}
      <p className="text-[#D4AF37] font-medium text-sm sm:text-base tracking-[0.25em] uppercase mb-4">
        Divine Essentials for Daily Seva
      </p>

      {/* Main heading */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4">
        Mera Gopal
      </h1>

      {/* Subheading */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#D4AF37] leading-tight mb-6">
        Shop with Devotion
      </h2>

      {/* Description */}
      <p className="text-white text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8">
        Discover beautiful Laddu Gopal collections, Radha Rani attire,
        puja essentials, malas, gemstones and devotional treasures for
        your daily seva.
      </p>

      {/* Main buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">

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

      {/* Quick category links */}
      <div className="flex flex-wrap gap-4 justify-center text-sm sm:text-base">

        <Link
          href="/categories/laddu-gopal"
          className="underline text-white hover:text-[#D4AF37]"
        >
          Laddu Gopal
        </Link>

        <span className="text-white/60">·</span>

        <Link
          href="/categories/radha-rani"
          className="underline text-white hover:text-[#D4AF37]"
        >
          Radha Rani
        </Link>

        <span className="text-white/60">·</span>

        <Link
          href="/categories/gemstones"
          className="underline text-white hover:text-[#D4AF37]"
        >
          Gemstones
        </Link>

        <span className="text-white/60">·</span>

        <Link
          href="/kundli"
          className="underline text-white hover:text-[#D4AF37]"
        >
          Kundli
        </Link>

      </div>

    </div>
  </div>
</section>
