import { LegalPageShell } from "@/components/store/LegalPageShell";
import { siteConfig } from "@/lib/site";

export const metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <LegalPageShell title="About Us">
      <p>
        {siteConfig.name} is an online storefront for traditional puja items, deity attire,
        malas, ornaments, and gemstones managed by the store administrator.
      </p>
      <p>
        Catalogue data (names, prices, stock, descriptions, and photographs) is stored in the
        database and maintained through the Admin dashboard. Development environments may show
        placeholder images until real photographs are uploaded.
      </p>
      <p>
        Business contact details should be set via environment variables (for example{" "}
        <code>NEXT_PUBLIC_SUPPORT_EMAIL</code>) before any public launch. Do not rely on example
        placeholders as real business registration data.
      </p>
    </LegalPageShell>
  );
}
