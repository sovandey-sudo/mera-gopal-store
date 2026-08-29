import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div>
      <h2 className="text-xl font-bold text-[#2c1810] mb-2 capitalize">settings</h2>
      <p className="text-sm text-[#2c1810]/60">
        This section will be fully implemented in a later phase. The foundation is ready.
      </p>
    </div>
  );
}
