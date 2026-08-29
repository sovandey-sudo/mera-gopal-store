import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";

async function addAddress(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const fullName = formData.get("fullName") as string;
  const phone = formData.get("phone") as string;
  const addressLine1 = formData.get("addressLine1") as string;
  const addressLine2 = (formData.get("addressLine2") as string) || null;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const postalCode = formData.get("postalCode") as string;
  const isDefault = formData.get("isDefault") === "on";

  if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode) {
    return;
  }

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  await prisma.address.create({
    data: {
      userId: session.user.id,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country: "India",
      isDefault,
    },
  });

  revalidatePath("/account/addresses");
}

async function deleteAddress(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const id = formData.get("id") as string;

  // Ensure the address belongs to this user (IDOR protection)
  const address = await prisma.address.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!address) return;

  await prisma.address.delete({ where: { id } });
  revalidatePath("/account/addresses");
}

export default async function AddressesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <Link href="/account" className="text-sm text-[#8B0000] hover:underline">
          ← Back to Account
        </Link>
        <h1 className="text-2xl font-bold text-[#2c1810] mt-2">Saved Addresses</h1>
      </div>

      {/* Existing addresses */}
      {addresses.length > 0 && (
        <ul className="space-y-3 mb-8">
          {addresses.map((addr) => (
            <li
              key={addr.id}
              className="bg-white border border-[#e8dfd0] rounded-xl p-4 flex justify-between gap-4"
            >
              <div className="text-sm">
                <p className="font-medium text-[#2c1810]">
                  {addr.fullName}
                  {addr.isDefault && (
                    <span className="ml-2 text-xs bg-[#D4AF37]/20 text-[#8B0000] px-1.5 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </p>
                <p className="text-[#2c1810]/70 mt-1">
                  {addr.addressLine1}
                  {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                </p>
                <p className="text-[#2c1810]/70">
                  {addr.city}, {addr.state} {addr.postalCode}
                </p>
                <p className="text-[#2c1810]/60 mt-1">{addr.phone}</p>
              </div>
              <form action={deleteAddress}>
                <input type="hidden" name="id" value={addr.id} />
                <button
                  type="submit"
                  className="text-xs text-red-600 hover:underline"
                >
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}

      {/* Add new address */}
      <div className="bg-white border border-[#e8dfd0] rounded-xl p-5">
        <h2 className="font-semibold text-[#2c1810] mb-4">Add New Address</h2>
        <form action={addAddress} className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Full Name *</label>
              <input
                name="fullName"
                required
                className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Phone *</label>
              <input
                name="phone"
                required
                className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Address Line 1 *</label>
            <input
              name="addressLine1"
              required
              className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Address Line 2</label>
            <input
              name="addressLine2"
              className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm"
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">City *</label>
              <input
                name="city"
                required
                className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">State *</label>
              <input
                name="state"
                required
                className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">PIN Code *</label>
              <input
                name="postalCode"
                required
                className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" name="isDefault" className="rounded" />
            Set as default address
          </label>
          <button
            type="submit"
            className="px-4 py-2 bg-[#8B0000] text-white text-sm font-medium rounded-lg hover:bg-[#6B0000]"
          >
            Save Address
          </button>
        </form>
      </div>
    </div>
  );
}
