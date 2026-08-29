"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";

interface ProductMatch {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  certificateAvailable: boolean;
  certificateFee: number | null;
  certificateDisclosure: string | null;
  weight: number | null;
  shortDescription: string | null;
  imageUrl: string | null;
}

interface Recommendation {
  ruleId: string;
  ruleName: string;
  planet: string | null;
  recommendedGemstone: string;
  alternativeGemstone: string | null;
  explanation: string | null;
  caution: string | null;
  products: ProductMatch[];
}

interface Result {
  success: boolean;
  message: string;
  hasChartData: boolean;
  recommendations: Recommendation[];
  disclaimer: string;
}

export default function GemstonePredictionPage() {
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Optional birth form for chart-aware recommendations
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
  });
  const [formLoading, setFormLoading] = useState(false);

  async function loadGeneral() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/astrology/recommend");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load");
        return;
      }
      setResult(data);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGeneral();
  }, []);

  async function handleChartSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormLoading(true);
    setError("");
    try {
      const res = await fetch("/api/astrology/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed");
        return;
      }
      setResult(data);
      setShowForm(false);
    } catch {
      setError("Network error");
    } finally {
      setFormLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#2c1810]">
          Gemstone Recommendations
        </h1>
        <p className="text-sm text-[#2c1810]/60 mt-2 max-w-lg mx-auto">
          Traditional associations mapped to real products in our catalog.
          Recommendations follow rules configured by the administrator.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-900">
        <p className="font-medium mb-1">Important Disclaimer</p>
        <p>
          {result?.disclaimer ||
            "Gemstone recommendations are based on traditional astrological associations. They are not scientifically proven medical, financial, or guaranteed outcomes. Consult a qualified astrologer and relevant professionals before wearing or purchasing any gemstone."}
        </p>
      </div>

      {/* Chart-aware option */}
      <div className="bg-white border border-[#e8dfd0] rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#2c1810]">
            Want chart-based matching?
          </p>
          <p className="text-xs text-[#2c1810]/60">
            Provide birth details (calculation engine still under development — rules will still apply).
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Hide Form" : "Enter Birth Details"}
          </Button>
          <Link href="/kundli">
            <Button variant="ghost" size="sm">
              Full Kundli →
            </Button>
          </Link>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleChartSubmit}
          className="bg-white border border-[#e8dfd0] rounded-xl p-5 mb-6 grid sm:grid-cols-2 gap-3"
        >
          <input
            required
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm"
          />
          <input
            type="date"
            required
            value={form.dateOfBirth}
            onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
            className="px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm"
          />
          <input
            type="time"
            required
            value={form.timeOfBirth}
            onChange={(e) => setForm({ ...form, timeOfBirth: e.target.value })}
            className="px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm"
          />
          <input
            required
            placeholder="Place of birth"
            value={form.placeOfBirth}
            onChange={(e) => setForm({ ...form, placeOfBirth: e.target.value })}
            className="px-3 py-2 border border-[#e8dfd0] rounded-lg text-sm"
          />
          <div className="sm:col-span-2">
            <Button type="submit" disabled={formLoading}>
              {formLoading ? "Processing..." : "Get Recommendations"}
            </Button>
          </div>
        </form>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {loading && (
        <p className="text-center text-[#2c1810]/60 py-12">Loading recommendations...</p>
      )}

      {result && !loading && (
        <>
          <p className="text-sm text-[#2c1810]/70 mb-6">{result.message}</p>

          {result.recommendations.length === 0 ? (
            <div className="text-center py-12 text-[#2c1810]/60">
              <p>No recommendation rules configured yet.</p>
              <p className="text-sm mt-1">An administrator can add rules in the admin panel.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {result.recommendations.map((rec) => (
                <section
                  key={rec.ruleId}
                  className="bg-white border border-[#e8dfd0] rounded-xl p-5"
                >
                  <div className="mb-4">
                    <h2 className="font-semibold text-[#2c1810] text-lg">
                      {rec.recommendedGemstone}
                      {rec.alternativeGemstone && (
                        <span className="text-[#2c1810]/60 font-normal text-base">
                          {" "}
                          / {rec.alternativeGemstone}
                        </span>
                      )}
                    </h2>
                    {rec.planet && (
                      <p className="text-xs text-[#8B0000] font-medium mt-0.5">
                        Associated with {rec.planet}
                      </p>
                    )}
                    {rec.explanation && (
                      <p className="text-sm text-[#2c1810]/70 mt-2">{rec.explanation}</p>
                    )}
                    {rec.caution && (
                      <p className="text-xs text-amber-700 mt-2 bg-amber-50 rounded px-2 py-1 inline-block">
                        {rec.caution}
                      </p>
                    )}
                  </div>

                  {rec.products.length === 0 ? (
                    <p className="text-sm text-[#2c1810]/50">
                      No matching products currently in the catalog for this gemstone.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {rec.products.map((p) => (
                        <Link
                          key={p.id}
                          href={`/products/${p.slug}`}
                          className="border border-[#e8dfd0] rounded-lg p-3 hover:border-[#8B0000]/40 transition-colors"
                        >
                          <div className="aspect-square bg-[#f5f0e8] rounded-lg flex items-center justify-center text-3xl mb-2">
                            💎
                          </div>
                          <p className="font-medium text-sm text-[#2c1810] line-clamp-2">
                            {p.name}
                          </p>
                          {p.weight && (
                            <p className="text-xs text-[#2c1810]/50 mt-0.5">
                              {p.weight} carat
                            </p>
                          )}
                          <p className="font-bold text-[#8B0000] text-sm mt-1">
                            {formatPrice(p.price)}
                          </p>
                          {p.certificateAvailable && (
                            <p className="text-xs text-amber-700 mt-1">
                              Optional certificate
                              {p.certificateFee
                                ? ` (+${formatPrice(p.certificateFee)})`
                                : ""}
                            </p>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
