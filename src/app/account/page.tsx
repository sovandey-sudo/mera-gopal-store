import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/lib/auth";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      _count: {
        select: { orders: true, addresses: true },
      },
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-[#2c1810] mb-1">My Account</h1>
      <p className="text-sm text-[#2c1810]/60 mb-8">
        Welcome back{user.name ? `, ${user.name}` : ""}
      </p>

      {/* Profile card */}
      <div className="bg-white border border-[#e8dfd0] rounded-xl p-5 mb-6">
        <h2 className="font-semibold text-[#2c1810] mb-3">Profile</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex">
            <dt className="w-24 text-[#2c1810]/60">Name</dt>
            <dd>{user.name || "—"}</dd>
          </div>
          <div className="flex">
            <dt className="w-24 text-[#2c1810]/60">Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div className="flex">
            <dt className="w-24 text-[#2c1810]/60">Phone</dt>
            <dd>{user.phone || "—"}</dd>
          </div>
          <div className="flex">
            <dt className="w-24 text-[#2c1810]/60">Member since</dt>
            <dd>{user.createdAt.toLocaleDateString("en-IN")}</dd>
          </div>
        </dl>
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Link
          href="/account/orders"
          className="bg-white border border-[#e8dfd0] rounded-xl p-5 hover:border-[#8B0000]/40 transition-colors"
        >
          <p className="text-2xl mb-1">📦</p>
          <p className="font-semibold text-[#2c1810]">Orders</p>
          <p className="text-sm text-[#2c1810]/60">
            {user._count.orders} order{user._count.orders !== 1 ? "s" : ""}
          </p>
        </Link>

        <Link
          href="/account/addresses"
          className="bg-white border border-[#e8dfd0] rounded-xl p-5 hover:border-[#8B0000]/40 transition-colors"
        >
          <p className="text-2xl mb-1">📍</p>
          <p className="font-semibold text-[#2c1810]">Addresses</p>
          <p className="text-sm text-[#2c1810]/60">
            {user._count.addresses} saved
          </p>
        </Link>
      </div>

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          className="text-sm text-red-600 hover:underline"
        >
          Sign Out
        </button>
      </form>
    </div>
  );
}
