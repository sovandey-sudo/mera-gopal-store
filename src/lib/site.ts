/** Site display settings — override via env for staging/production branding */
export const siteConfig = {
  name: process.env.NEXT_PUBLIC_STORE_NAME || "Devotional Store",
  tagline: process.env.NEXT_PUBLIC_STORE_TAGLINE || "Divine essentials for daily seva",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@example.com",
  /** Placeholder only — set real values via env before production */
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || "",
};
