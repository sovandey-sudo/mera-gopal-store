import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { revalidatePath } from "next/cache";

async function toggleBundle(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;
  const current = formData.get("isActive") === "true";

  await prisma.bundleOffer.update({
    where: { id },
    data: { isActive: !current },
  });

  revalidatePath("/admin/bundles");
}

async function updateMinimum(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;
  const min = parseInt(formData.get("minimumQuantity") as string, 10);
  const value = parseFloat(formData.get("discountValue") as string);
  const message = formData.get("message") as string;

  if (isNaN(min) || min < 1) return;

  await prisma.bundleOffer.update({
    where: { id },
    data: {
      minimumQuantity: min,
      discountValue: isNaN(value) ? undefined : value,
      message: message || undefined,
    },
  });

  revalidatePath("/admin/bundles");
}

export default async function AdminBundlesPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const offers = await prisma.bundleOffer.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#2c1810]">Bundle / Savings Offers</h2>
        <p className="text-sm text-[#2c1810]/60">
          Configure the 5-item (or custom) transportation savings system. All calculations happen on the server.
        </p>
      </div>

      {offers.length === 0 ? (
        <div className="bg-white border border-[#e8dfd0] rounded-xl p-8 text-center text-[#2c1810]/60">
          No bundle offers yet. Run the database seed to create the default 5-item offer.
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white border border-[#e8dfd0] rounded-xl p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-semibold text-[#2c1810]">{offer.name}</h3>
                  <p className="text-sm text-[#2c1810]/60 mt-0.5">
                    Type: {offer.discountType.replace("_", " ")} · Value:{" "}
                    {offer.discountType === "PERCENTAGE"
                      ? `${offer.discountValue}%`
                      : formatPrice(Number(offer.discountValue))}
                  </p>
                </div>
                <form action={toggleBundle}>
                  <input type="hidden" name="id" value={offer.id} />
                  <input type="hidden" name="isActive" value={String(offer.isActive)} />
                  <button
                    type="submit"
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      offer.isActive
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    {offer.isActive ? "Active" : "Inactive"}
                  </button>
                </form>
              </div>

              <form action={updateMinimum} className="grid sm:grid-cols-3 gap-3 items-end">
                <input type="hidden" name="id" value={offer.id} />
                <div>
                  <label className="block text-xs font-medium text-[#2c1810]/70 mb-1">
                    Minimum Quantity
                  </label>
                  <input
                    type="number"
                    name="minimumQuantity"
                    min={1}
                    defaultValue={offer.minimumQuantity}
                    className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#2c1810]/70 mb-1">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    name="discountValue"
                    min={0}
                    step="0.01"
                    defaultValue={Number(offer.discountValue)}
                    className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#2c1810]/70 mb-1">
                    Customer Message
                  </label>
                  <input
                    type="text"
                    name="message"
                    defaultValue={offer.message || ""}
                    placeholder="Add {remaining} more items..."
                    className="w-full px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm"
                  />
                </div>
                <div className="sm:col-span-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#8B0000] text-white text-sm font-medium rounded-lg hover:bg-[#6B0000]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>

              <p className="text-xs text-[#2c1810]/50 mt-3">
                Use <code className="bg-[#f5f0e8] px-1 rounded">{"{remaining}"}</code> in the
                message to show how many more items are needed.
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-[#f5f0e8] border border-[#e8dfd0] rounded-xl text-sm text-[#2c1810]/70">
        <p className="font-medium text-[#2c1810] mb-1">How it works</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Only products marked <strong>Bundle Eligible</strong> count toward the minimum.</li>
          <li>Prices and discounts are always calculated on the server — never trusted from the browser.</li>
          <li>Customers see a progress bar and message in the cart.</li>
          <li>You can change the minimum quantity (default 5) and discount amount anytime.</li>
        </ul>
      </div>
    </div>
  );
}
