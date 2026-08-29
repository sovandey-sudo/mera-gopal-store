import type { AstrologyService, BirthData, AstrologyCalculationResult } from "./types";

/**
 * Stub calculation engine.
 * Used until a real Swiss Ephemeris (or equivalent) integration is added.
 * Explicitly returns "under development" — never fabricates planetary data.
 */
export const stubAstrologyService: AstrologyService = {
  async calculate(birth: BirthData): Promise<AstrologyCalculationResult> {
    // Basic validation only
    if (!birth.dateOfBirth || !birth.timeOfBirth || !birth.placeOfBirth) {
      return {
        engine: "stub",
        calculatedAt: new Date().toISOString(),
        success: false,
        error: "Date of birth, time of birth, and place of birth are required.",
      };
    }

    // Intentionally do NOT calculate or invent any planetary positions
    return {
      engine: "stub",
      calculatedAt: new Date().toISOString(),
      success: false,
      error:
        "Astrology calculation module is under development. A legitimate ephemeris engine (such as Swiss Ephemeris) will be integrated in a future update. No planetary positions have been calculated or invented.",
    };
  },
};
