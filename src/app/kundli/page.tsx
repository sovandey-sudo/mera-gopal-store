"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { AstrologyCalculationResult } from "@/lib/astrology";

export default function KundliPage() {
  const [form, setForm] = useState({
    name: "",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
    country: "India",
    saveProfile: false,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AstrologyCalculationResult | null>(null);
  const [error, setError] = useState("");

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/astrology/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok && data.error && !data.engine) {
        setError(typeof data.error === "string" ? data.error : "Request failed");
        setLoading(false);
        return;
      }

      setResult(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#2c1810]">
          Kundli / Birth Chart
        </h1>
        <p className="text-sm text-[#2c1810]/60 mt-2 max-w-md mx-auto">
          Enter birth details to generate a traditional Vedic birth chart analysis.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-900">
        <p className="font-medium mb-1">Important Disclaimer</p>
        <p>
          Astrology results are based on traditional systems and are for guidance
          and cultural interest only. They are not scientifically proven medical,
          financial, or guaranteed predictions. Please consult qualified
          professionals for medical, legal, or financial matters.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#e8dfd0] rounded-xl p-5 sm:p-6 space-y-4 mb-8"
      >
        <div>
          <label className="block text-sm font-medium text-[#2c1810] mb-1.5">
            Full Name *
          </label>
          <input
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full px-3.5 py-2.5 border border-[#e8dfd0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000]"
            placeholder="As per official records"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#2c1810] mb-1.5">
              Date of Birth *
            </label>
            <input
              type="date"
              required
              value={form.dateOfBirth}
              onChange={(e) => update("dateOfBirth", e.target.value)}
              className="w-full px-3.5 py-2.5 border border-[#e8dfd0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2c1810] mb-1.5">
              Time of Birth * (24-hour)
            </label>
            <input
              type="time"
              required
              value={form.timeOfBirth}
              onChange={(e) => update("timeOfBirth", e.target.value)}
              className="w-full px-3.5 py-2.5 border border-[#e8dfd0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#2c1810] mb-1.5">
            Place of Birth *
          </label>
          <input
            required
            value={form.placeOfBirth}
            onChange={(e) => update("placeOfBirth", e.target.value)}
            className="w-full px-3.5 py-2.5 border border-[#e8dfd0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000]"
            placeholder="City, State"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#2c1810] mb-1.5">
            Country
          </label>
          <input
            value={form.country}
            onChange={(e) => update("country", e.target.value)}
            className="w-full px-3.5 py-2.5 border border-[#e8dfd0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000]"
          />
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={form.saveProfile}
            onChange={(e) => update("saveProfile", e.target.checked)}
            className="rounded border-[#e8dfd0]"
          />
          Save this profile to my account (requires login)
        </label>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Calculating..." : "Generate Kundli"}
        </Button>
      </form>

      {/* Results */}
      {result && (
        <div className="bg-white border border-[#e8dfd0] rounded-xl p-5 sm:p-6">
          <h2 className="font-semibold text-[#2c1810] mb-4">Chart Result</h2>

          {!result.success ? (
            <div className="bg-[#f5f0e8] border border-[#e8dfd0] rounded-lg p-5 text-center">
              <p className="text-3xl mb-3">🕉️</p>
              <p className="font-medium text-[#2c1810] mb-2">
                Astrology Calculation Module is Under Development
              </p>
              <p className="text-sm text-[#2c1810]/70 max-w-md mx-auto">
                {result.error ||
                  "A legitimate astronomical calculation engine will be integrated soon. We do not invent or display approximate planetary positions."}
              </p>
              <p className="text-xs text-[#2c1810]/50 mt-4">
                Engine: {result.engine} · {new Date(result.calculatedAt).toLocaleString()}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* This block will render when a real engine is connected */}
              {result.lagna && (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-[#f5f0e8] rounded-lg p-3">
                    <p className="text-[#2c1810]/60 text-xs">Lagna (Ascendant)</p>
                    <p className="font-semibold">{result.lagna}</p>
                  </div>
                  {result.moonSign && (
                    <div className="bg-[#f5f0e8] rounded-lg p-3">
                      <p className="text-[#2c1810]/60 text-xs">Moon Sign (Rashi)</p>
                      <p className="font-semibold">{result.moonSign}</p>
                    </div>
                  )}
                  {result.sunSign && (
                    <div className="bg-[#f5f0e8] rounded-lg p-3">
                      <p className="text-[#2c1810]/60 text-xs">Sun Sign</p>
                      <p className="font-semibold">{result.sunSign}</p>
                    </div>
                  )}
                  {result.nakshatra && (
                    <div className="bg-[#f5f0e8] rounded-lg p-3">
                      <p className="text-[#2c1810]/60 text-xs">Nakshatra</p>
                      <p className="font-semibold">
                        {result.nakshatra}
                        {result.nakshatraPada ? ` (Pada ${result.nakshatraPada})` : ""}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {result.planets && result.planets.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-[#2c1810] mb-2">
                    Planetary Positions
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-[#2c1810]/60 border-b border-[#e8dfd0]">
                          <th className="py-2 pr-2">Planet</th>
                          <th className="py-2 pr-2">Sign</th>
                          <th className="py-2 pr-2">Degree</th>
                          <th className="py-2">House</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.planets.map((p) => (
                          <tr key={p.planet} className="border-b border-[#e8dfd0]/50">
                            <td className="py-2 pr-2 font-medium">
                              {p.planet}
                              {p.retrograde ? " (R)" : ""}
                            </td>
                            <td className="py-2 pr-2">{p.sign}</td>
                            <td className="py-2 pr-2">{p.degree.toFixed(2)}°</td>
                            <td className="py-2">{p.house ?? "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <p className="text-xs text-[#2c1810]/50">
                Calculated by {result.engine} at{" "}
                {new Date(result.calculatedAt).toLocaleString()}
              </p>
            </div>
          )}

          {/* Next step teaser */}
          <div className="mt-6 pt-5 border-t border-[#e8dfd0] text-center">
            <p className="text-sm text-[#2c1810]/70 mb-3">
              Once calculation is active, you will be able to receive gemstone
              recommendations based on traditional rules.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link href="/gemstone-prediction">
                <Button variant="outline" size="sm">
                  Gemstone Recommendations
                </Button>
              </Link>
              <Link href="/products?category=gemstones">
                <Button variant="ghost" size="sm">
                  Browse Catalog
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
