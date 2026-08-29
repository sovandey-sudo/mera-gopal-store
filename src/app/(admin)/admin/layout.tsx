import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Login page has its own layout feel — skip sidebar
  // We detect via a simple check; login is under /admin/login
  // For simplicity we always render sidebar except we can refine later.

  const session = await auth();

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      {session?.user ? (
        <div className="flex">
          <AdminSidebar user={session.user} />
          <div className="flex-1 min-w-0">
            <header className="bg-white border-b border-[#e8dfd0] px-4 sm:px-6 h-14 flex items-center justify-between sticky top-0 z-30">
              <h1 className="font-semibold text-[#2c1810] text-sm sm:text-base">
                Admin Dashboard
              </h1>
              <span className="text-xs text-[#2c1810]/60 hidden sm:inline">
                {session.user.email}
              </span>
            </header>
            <div className="p-4 sm:p-6">{children}</div>
          </div>
        </div>
      ) : (
        // Login page renders without sidebar
        children
      )}
    </div>
  );
}
