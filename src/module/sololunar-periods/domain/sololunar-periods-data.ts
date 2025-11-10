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

const normalizeTime = (time: string): string => {
  const [rawH, rawM] = time.split(":").map(Number);
  const h = rawH % 24; // mantém só a hora do dia
  const m = rawM; // já vem correto
  const hh = h.toString().padStart(2, "0");
  const mm = m.toString().padStart(2, "0");
  return `${hh}:${mm}`;
};

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
    sunRise: normalizeTime(data.sunRise),
    sunTransit: normalizeTime(data.sunTransit),
    sunSet: normalizeTime(data.sunSet),
    moonRise: normalizeTime(data.moonRise),
    moonTransit: normalizeTime(data.moonTransit),
    moonUnderfoot: normalizeTime(data.moonUnderfoot),
    moonSet: normalizeTime(data.moonSet),
    moonPhase: data.moonPhase,
    moonIllumination: data.moonIllumination,
    majorPeriods: data.majorPeriods.map((period) => ({
      start: normalizeTime(period.start),
      end: normalizeTime(period.end),
    })),
    minorPeriods: data.minorPeriods.map((period) => ({
      start: normalizeTime(period.start),
      end: normalizeTime(period.end),
    })),
    dayRating: data.dayRating,
    hourlyRating: data.hourlyRating,
  });
}
