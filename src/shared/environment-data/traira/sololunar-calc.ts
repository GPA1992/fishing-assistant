import { clamp, smoothLerp } from "../algorithms";

type Period = { start: string; end: string };

export type SolunarInput = {
  sunRise: string; // "07:24"
  sunTransit: string; // "14:01"
  sunSet: string; // "20:37"
  moonRise: string; // "02:47"
  moonTransit: string; // "07:34"
  moonUnderfoot: string; // "20:01"
  moonSet: string; // "13:07"
  majorPeriods: Period[]; // ex: [{ start:"06:34", end:"08:33" }, ...]
  minorPeriods: Period[]; // ex: [{ start:"02:17", end:"03:17" }, ...]
};

const MIN_IN_HOUR = 60;

const toMinutesOfDay = (time: string): number => {
  const [hh, mm] = time.split(":").map(Number);
  const h = clamp(hh || 0, 0, 23);
  const m = clamp(mm || 0, 0, 59);
  return h * MIN_IN_HOUR + m;
};

const periodToMinutes = (p: Period): { start: number; end: number } => ({
  start: toMinutesOfDay(p.start),
  end: toMinutesOfDay(p.end),
});

const overlapMinutes = (
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number
): number => {
  const s = Math.max(aStart, bStart);
  const e = Math.min(aEnd, bEnd);
  return Math.max(0, e - s);
};

const hourScoreFromPeriod = (
  hourStart: number,
  period: { start: number; end: number },
  baseScore: number
): number => {
  const hourEnd = hourStart + 60;
  const len = Math.max(1, period.end - period.start);
  const ov = overlapMinutes(hourStart, hourEnd, period.start, period.end);
  const frac = ov / len; // 0-1
  return baseScore * frac;
};

/**
 * Bônus por alinhamento solunar com nascer/pôr do sol.
 * Até +10 somando todos os alinhamentos.
 */
const alignmentBonus = (input: SolunarInput): number => {
  const sunrise = toMinutesOfDay(input.sunRise);
  const sunset = toMinutesOfDay(input.sunSet);

  const centers: number[] = [
    ...input.majorPeriods.map((p) => {
      const { start, end } = periodToMinutes(p);
      return (start + end) / 2;
    }),
    ...input.minorPeriods.map((p) => {
      const { start, end } = periodToMinutes(p);
      return (start + end) / 2;
    }),
  ];

  let bonus = 0;

  for (const c of centers) {
    const dSunrise = Math.abs(c - sunrise);
    const dSunset = Math.abs(c - sunset);

    if (dSunrise <= 90) {
      bonus += smoothLerp(dSunrise, 0, 90, 5, 0);
    }
    if (dSunset <= 90) {
      bonus += smoothLerp(dSunset, 0, 90, 5, 0);
    }
  }

  return clamp(Math.round(bonus), 0, 10);
};

/**
 * Score horário solunar (0–23) com base em major/minor.
 * Major: base 100. Minor: base 60.
 */
export const buildSolunarHourlyScore = (
  input: SolunarInput
): Record<number, number> => {
  const major = input.majorPeriods.map(periodToMinutes);
  const minor = input.minorPeriods.map(periodToMinutes);

  const result: Record<number, number> = {};

  for (let h = 0; h < 24; h++) {
    const hourStart = h * 60;
    let score = 0;

    for (const p of major) {
      score += hourScoreFromPeriod(hourStart, p, 100);
    }

    for (const p of minor) {
      score += hourScoreFromPeriod(hourStart, p, 60);
    }

    result[h] = Math.round(clamp(score, 0, 100));
  }

  return result;
};

/**
 * Score diário solunar (0–100).
 * Média do horário + bônus de alinhamento.
 */
export const buildSolunarDailyScore = (input: SolunarInput): number => {
  const hourly = buildSolunarHourlyScore(input);

  let sum = 0;
  for (let h = 0; h < 24; h++) sum += hourly[h];

  const baseAvg = sum / 24;
  const bonus = alignmentBonus(input);

  return clamp(Math.round(baseAvg + bonus), 0, 100);
};

/**
 * Saída consolidada.
 */
export const buildSolunarScores = (input: SolunarInput) => {
  const solunarHourlyScore = buildSolunarHourlyScore(input);
  const solunarDailyScore = buildSolunarDailyScore(input);

  return {
    solunarDailyScore,
    solunarHourlyScore,
  };
};
