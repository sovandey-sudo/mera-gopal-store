import Link from "next/link";

export function LegalPageShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <strong>Draft for MVP testing.</strong> Content requires owner and legal
        review before production use. Do not treat this as formal legal advice
        or compliance certification.
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-[#2c1810] mb-6">{title}</h1>
      <div className="prose prose-sm max-w-none text-[#2c1810]/80 space-y-4">
        {children}
      </div>
      <p className="mt-10 text-sm">
        <Link href="/" className="text-[#8B0000] hover:underline">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
