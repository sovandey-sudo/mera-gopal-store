import { LegalPageShell } from "@/components/store/LegalPageShell";
import { siteConfig } from "@/lib/site";

export const metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms & Conditions (Draft)">
      <p>
        By using {siteConfig.name} you agree to these draft terms for MVP testing purposes.
      </p>
      <p>
        Products, prices, and availability are as shown at checkout and confirmed in your order.
        Mock payments in development do not transfer real money.
      </p>
      <p>
        Astrology and gemstone content is informational/traditional only and does not create
        guaranteed outcomes.
      </p>
      <p>
        The store operator may update catalogue, pricing, and these terms. Have legal counsel
        review before production.
      </p>
    </LegalPageShell>
  );
}
