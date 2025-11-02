export interface VisualCrossingAstronomyResponse {
  queryCost: number;
  latitude: number;
  longitude: number;
  resolvedAddress: string;
  address: string;
  timezone: string;
  tzoffset: number;
  days: AstronomyDayData[];
}

export interface AstronomyDayData {
  datetime: string;
  sunrise: string;
  sunset: string;
  moonphase: number;
  moonrise?: string;
  moonset?: string;
}
