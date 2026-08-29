import { LegalPageShell } from "@/components/store/LegalPageShell";

export const metadata = { title: "Astrology & Gemstone Disclaimer" };

export default function DisclaimerPage() {
  return (
    <LegalPageShell title="Astrology & Gemstone Disclaimer">
      <p>
        <strong>Astrology:</strong> The Kundli calculation module is under development. This
        application does not invent planetary positions and does not present unfinished
        calculations as complete birth charts.
      </p>
      <p>
        <strong>Gemstones:</strong> Any recommendations are based on traditional associations
        and rules configured by the administrator. They are not medical treatments, financial
        advice, or guaranteed results.
      </p>
      <p>
        <strong>Certificates:</strong> Optional certificate fees and disclosures appear only when
        entered by Admin. This website does not issue laboratory certificates or invent certificate
        numbers.
      </p>
      <p>
        <strong>Photographs:</strong> Images may be development placeholders until Admin uploads
        real product photographs. Physical products may vary slightly from images.
      </p>
    </LegalPageShell>
  );
}
