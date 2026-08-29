import { LegalPageShell } from "@/components/store/LegalPageShell";
import { siteConfig } from "@/lib/site";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPageShell title="Privacy Policy (Draft)">
      <p>
        This draft describes how {siteConfig.name} intends to handle information collected during
        MVP testing. It is not a certified privacy notice.
      </p>
      <p>
        <strong>Data we may collect:</strong> name, email, phone, delivery addresses, order
        details, and optional birth details if you use Kundli features and choose to save a
        profile.
      </p>
      <p>
        <strong>Use:</strong> account access, order fulfilment, and optional astrology-related
        features you request. We do not sell personal data as part of this MVP description.
      </p>
      <p>
        <strong>Storage:</strong> data is stored in the application database configured by the
        operator. Card or UPI credentials are not stored by this mock-payment MVP.
      </p>
      <p>
        Contact: {siteConfig.supportEmail}. Replace this draft with a reviewed policy before
        production.
      </p>
    </LegalPageShell>
  );
}
