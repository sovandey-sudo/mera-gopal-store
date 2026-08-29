import { LegalPageShell } from "@/components/store/LegalPageShell";
import { siteConfig } from "@/lib/site";

export const metadata = { title: "Returns & Refunds" };

export default function ReturnsPage() {
  return (
    <LegalPageShell title="Returns & Refunds (Draft)">
      <p>
        Return windows, eligible product types, and refund methods must be defined by the store
        owner. This page is a placeholder for MVP navigation testing.
      </p>
      <p>
        Gemstones and personalised items may have different rules. Contact{" "}
        {siteConfig.supportEmail} to discuss a specific order during testing.
      </p>
      <p>Do not rely on this draft as a binding refund guarantee.</p>
    </LegalPageShell>
  );
}
