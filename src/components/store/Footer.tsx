import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-[#2c1810] text-[#faf7f2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <p className="font-bold text-lg text-[#D4AF37] mb-2">{siteConfig.name}</p>
            <p className="text-sm text-[#faf7f2]/70 mb-3">{siteConfig.tagline}</p>
            <p className="text-xs text-[#faf7f2]/50">
              Support: {siteConfig.supportEmail}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-[#D4AF37]">Shop</h3>
            <ul className="space-y-2 text-sm text-[#faf7f2]/80">
              <li><Link href="/products" className="hover:text-white">All products</Link></li>
              <li><Link href="/categories/laddu-gopal" className="hover:text-white">Laddu Gopal</Link></li>
              <li><Link href="/categories/gemstones" className="hover:text-white">Gemstones</Link></li>
              <li><Link href="/kundli" className="hover:text-white">Kundli</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-[#D4AF37]">Help</h3>
            <ul className="space-y-2 text-sm text-[#faf7f2]/80">
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/policies/shipping" className="hover:text-white">Shipping</Link></li>
              <li><Link href="/policies/returns" className="hover:text-white">Returns</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-[#D4AF37]">Legal</h3>
            <ul className="space-y-2 text-sm text-[#faf7f2]/80">
              <li><Link href="/policies/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/policies/terms" className="hover:text-white">Terms & Conditions</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white">Astrology Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#faf7f2]/10 mt-10 pt-6 text-center text-xs text-[#faf7f2]/50">
          © {new Date().getFullYear()} {siteConfig.name}. MVP draft — not a production legal notice.
        </div>
      </div>
    </footer>
  );
}
