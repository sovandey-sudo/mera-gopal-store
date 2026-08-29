import { LegalPageShell } from "@/components/store/LegalPageShell";
import { siteConfig } from "@/lib/site";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <LegalPageShell title="Contact">
      <p>
        Email: <strong>{siteConfig.supportEmail}</strong>
      </p>
      {siteConfig.supportPhone ? (
        <p>Phone: {siteConfig.supportPhone}</p>
      ) : (
        <p>
          Phone and postal address are not published in this MVP draft. Configure support contact
          environment variables for your deployment.
        </p>
      )}
      <p>
        This page is for MVP testing. Update contact channels before production use.
      </p>
    </LegalPageShell>
  );
}
