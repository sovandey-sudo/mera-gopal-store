import { LegalPageShell } from "@/components/store/LegalPageShell";

export const metadata = { title: "Shipping Policy" };

export default function ShippingPage() {
  return (
    <LegalPageShell title="Shipping Policy (Draft)">
      <p>
        Shipping methods, regions, and timelines will be defined by the store operator. This MVP
        may show a calculated shipping fee of zero or a configured amount for testing.
      </p>
      <p>
        Bundle &quot;transportation savings&quot; discounts, when active, are applied only to
        eligible items according to Admin configuration and server-side rules.
      </p>
      <p>
        Replace this draft with operational shipping zones, carriers, and timeframes before
        launch.
      </p>
    </LegalPageShell>
  );
}
