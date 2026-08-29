import { prisma } from "@/lib/prisma";
import type { AstrologyCalculationResult } from "./types";

export interface GemstoneRecommendation {
  ruleId: string;
  ruleName: string;
  planet: string | null;
  recommendedGemstone: string;
  alternativeGemstone: string | null;
  explanation: string | null;
  caution: string | null;
  /** Matched products from catalog (real DB records) */
  products: {
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
  }[];
}

export interface RecommendationResult {
  success: boolean;
  message: string;
  /** Whether a real chart calculation was available */
  hasChartData: boolean;
  recommendations: GemstoneRecommendation[];
  disclaimer: string;
}

const DEFAULT_DISCLAIMER =
  "Gemstone recommendations are based on traditional astrological associations and the rules configured by the store administrator. They are not scientifically proven medical, financial, or guaranteed outcomes. Please consult a qualified astrologer and relevant professionals before wearing or purchasing any gemstone. Certificate availability and charges are disclosed on each product.";

/**
 * Rule-engine based gemstone recommendation.
 *
 * Flow:
 * 1. If real chart data exists → match rules by planet / conditions
 * 2. If no chart data (stub engine) → return active general rules
 * 3. Map recommended gemstone names to real products in the catalog
 *
 * Never invents planetary positions or certificate claims.
 */
export async function getGemstoneRecommendations(
  chart: AstrologyCalculationResult | null
): Promise<RecommendationResult> {
  const hasChartData = !!(chart?.success && chart.planets && chart.planets.length > 0);

  // Load active rules from database
  const rules = await prisma.gemstoneRule.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  });

  if (rules.length === 0) {
    return {
      success: true,
      message:
        "No gemstone recommendation rules have been configured yet. An administrator can add rules in the admin panel.",
      hasChartData,
      recommendations: [],
      disclaimer: DEFAULT_DISCLAIMER,
    };
  }

  // Determine which rules to surface
  let matchedRules = rules;

  if (hasChartData && chart?.planets) {
    // Prefer rules whose planet appears in the chart
    const chartPlanets = new Set(
      chart.planets.map((p) => p.planet.toLowerCase())
    );
    const planetMatched = rules.filter(
      (r) => r.planet && chartPlanets.has(r.planet.toLowerCase())
    );
    if (planetMatched.length > 0) {
      matchedRules = planetMatched;
    }
  }

  // Map each rule to catalog products by name match
  const recommendations: GemstoneRecommendation[] = [];

  for (const rule of matchedRules) {
    const searchTerms = [
      rule.recommendedGemstone,
      rule.alternativeGemstone,
    ].filter(Boolean) as string[];

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        productType: "gemstone",
        OR: searchTerms.flatMap((term) => [
          { name: { contains: term, mode: "insensitive" as const } },
          { shortDescription: { contains: term, mode: "insensitive" as const } },
        ]),
      },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
      },
      take: 6,
    });

    recommendations.push({
      ruleId: rule.id,
      ruleName: rule.name,
      planet: rule.planet,
      recommendedGemstone: rule.recommendedGemstone,
      alternativeGemstone: rule.alternativeGemstone,
      explanation: rule.explanation,
      caution: rule.caution,
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price),
        compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
        certificateAvailable: p.certificateAvailable,
        certificateFee: p.certificateFee ? Number(p.certificateFee) : null,
        certificateDisclosure: p.certificateDisclosure,
        weight: p.weight ? Number(p.weight) : null,
        shortDescription: p.shortDescription,
        imageUrl: p.images[0]?.imageUrl ?? null,
      })),
    });
  }

  return {
    success: true,
    message: hasChartData
      ? "Recommendations based on your chart data and configured traditional rules."
      : "Showing traditional gemstone associations. Full chart-based matching will activate once the calculation engine is integrated.",
    hasChartData,
    recommendations,
    disclaimer: DEFAULT_DISCLAIMER,
  };
}
