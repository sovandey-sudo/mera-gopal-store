import Link from "next/link";

const navLinks = [
  { href: "/products", label: "Shop" },
  { href: "/categories/laddu-gopal", label: "Laddu Gopal" },
  { href: "/categories/radha-rani", label: "Radha Rani" },
  { href: "/categories/dresses", label: "Dresses" },
  { href: "/categories/gemstones", label: "Gemstones" },
  { href: "/kundli", label: "Kundli" },
  { href: "/gemstone-prediction", label: "Gem Guide" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#faf7f2]/95 backdrop-blur border-b border-[#e8dfd0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-18">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#8B0000] flex items-center justify-center text-white font-bold text-lg">
              ध
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-[#8B0000] text-lg leading-tight block">Devotional</span>
              <span className="text-xs text-[#2c1810]/70 -mt-0.5 block">Store</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-[#2c1810]/80 hover:text-[#8B0000] rounded-lg hover:bg-[#8B0000]/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/search"
              className="p-2 text-[#2c1810]/70 hover:text-[#8B0000] transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <Link
              href="/account"
              className="p-2 text-[#2c1810]/70 hover:text-[#8B0000] transition-colors"
              aria-label="Account"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
            <Link
              href="/cart"
              className="relative p-2 text-[#2c1810]/70 hover:text-[#8B0000] transition-colors"
              aria-label="Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Mobile category strip */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-hide">
          {navLinks.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-[#2c1810]/80 bg-white border border-[#e8dfd0] rounded-full hover:border-[#8B0000]/40"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
