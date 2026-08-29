"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/products", label: "Products", icon: "📦" },
  { href: "/admin/categories", label: "Categories", icon: "🏷️" },
  { href: "/admin/orders", label: "Orders", icon: "🛒" },
  { href: "/admin/bundles", label: "Bundles / Offers", icon: "🎁" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

interface Props {
  user: { name?: string | null; email: string; role: string };
}

export function AdminSidebar({ user }: Props) {
  const pathname = usePathname();

  // Hide sidebar on login page
  if (pathname === "/admin/login") return null;

  return (
    <aside className="hidden md:flex w-56 flex-col bg-[#2c1810] text-white min-h-screen sticky top-0">
      <div className="p-4 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#2c1810] font-bold text-sm">
            ध
          </div>
          <div>
            <span className="font-bold text-sm block">Devotional</span>
            <span className="text-[10px] text-white/60">Admin</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {links.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                active
                  ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <span className="text-base">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <div className="px-3 py-2 text-xs text-white/50 truncate">{user.email}</div>
        <div className="px-3 text-[10px] text-[#D4AF37] uppercase tracking-wide mb-2">
          {user.role.replace("_", " ")}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full text-left px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg"
        >
          Sign Out
        </button>
        <Link
          href="/"
          className="block px-3 py-2 text-sm text-white/50 hover:text-white mt-1"
        >
          ← View Store
        </Link>
      </div>
    </aside>
  );
}
