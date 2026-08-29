import type { AstrologyService } from "./types";
import { stubAstrologyService } from "./stub";

/**
 * Astrology service factory.
 * Swap stub → real Swiss Ephemeris engine later without changing UI code.
 */
export function getAstrologyService(): AstrologyService {
  const engine = process.env.ASTROLOGY_ENGINE || "stub";

  switch (engine) {
    case "stub":
      return stubAstrologyService;
    // case "swiss-ephemeris":
    //   return swissEphemerisService;
    default:
      return stubAstrologyService;
  }
}

export type { BirthData, AstrologyCalculationResult, PlanetPosition } from "./types";
