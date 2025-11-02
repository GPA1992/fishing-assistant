export interface SolunarApiResponse {
  sunRise: string;
  sunTransit: string;
  sunSet: string;
  moonRise: string;
  moonTransit: string;
  moonUnder: string;
  moonSet: string;
  moonPhase: string;
  moonIllumination: number;
  major1Start: string;
  major1Stop: string;
  major2Start: string;
  major2Stop: string;
  minor1Start: string;
  minor1Stop: string;
  minor2Start: string;
  minor2Stop: string;
  dayRating: number;
  hourlyRating: Record<number, number>;
}
