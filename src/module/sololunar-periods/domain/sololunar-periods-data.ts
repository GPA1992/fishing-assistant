export type SolunarPeriod = Readonly<{
  date: Date;
  sunRise: string;
  sunTransit: string;
  sunSet: string;
  moonRise: string;
  moonTransit: string;
  moonUnderfoot: string;
  moonSet: string;
  moonPhase: string;
  moonIllumination: number;
  majorPeriods: { start: string; end: string }[];
  minorPeriods: { start: string; end: string }[];
  dayRating: number;
  hourlyRating: Record<number, number>;
}>;

export function makeSolunarPeriod(data: {
  date: Date;
  sunRise: string;
  sunTransit: string;
  sunSet: string;
  moonRise: string;
  moonTransit: string;
  moonUnderfoot: string;
  moonSet: string;
  moonPhase: string;
  moonIllumination: number;
  majorPeriods: { start: string; end: string }[];
  minorPeriods: { start: string; end: string }[];
  dayRating: number;
  hourlyRating: Record<number, number>;
}): SolunarPeriod {
  return Object.freeze({
    date: data.date,
    sunRise: data.sunRise,
    sunTransit: data.sunTransit,
    sunSet: data.sunSet,
    moonRise: data.moonRise,
    moonTransit: data.moonTransit,
    moonUnderfoot: data.moonUnderfoot,
    moonSet: data.moonSet,
    moonPhase: data.moonPhase,
    moonIllumination: data.moonIllumination,
    majorPeriods: data.majorPeriods,
    minorPeriods: data.minorPeriods,
    dayRating: data.dayRating,
    hourlyRating: data.hourlyRating,
  });
}
