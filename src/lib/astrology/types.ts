/**
 * Structured astrology result format.
 * Calculation engine MUST populate these fields from real ephemeris data.
 * Never invent or hard-code planetary positions.
 */

export interface BirthData {
  name: string;
  dateOfBirth: string; // YYYY-MM-DD
  timeOfBirth: string; // HH:mm (24h)
  placeOfBirth: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  country?: string;
}

export interface PlanetPosition {
  planet: string;
  sign: string;       // Rashi
  degree: number;
  house?: number;
  retrograde?: boolean;
  nakshatra?: string;
  pada?: number;
}

export interface HouseCusp {
  house: number;
  sign: string;
  degree: number;
}

export interface DashaPeriod {
  planet: string;
  startDate: string;
  endDate: string;
  level?: "mahadasha" | "antardasha" | "pratyantardasha";
}

export interface AstrologyCalculationResult {
  /** Engine / library that produced this result */
  engine: string;
  /** ISO timestamp of calculation */
  calculatedAt: string;
  /** Whether calculation was successful */
  success: boolean;
  /** Human-readable error if success=false */
  error?: string;

  // Core chart data (only present when success=true and engine is real)
  lagna?: string;
  lagnaDegree?: number;
  moonSign?: string;
  sunSign?: string;
  planets?: PlanetPosition[];
  houses?: HouseCusp[];
  currentDasha?: DashaPeriod[];
  nakshatra?: string;
  nakshatraPada?: number;

  /** Raw structured data for future AI interpretation layer */
  raw?: Record<string, unknown>;
}

export interface AstrologyService {
  /**
   * Calculate chart from birth data.
   * Must use a legitimate ephemeris library.
   * Must NOT invent positions.
   */
  calculate(birth: BirthData): Promise<AstrologyCalculationResult>;
}
