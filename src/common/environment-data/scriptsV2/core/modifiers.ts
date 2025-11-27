import type { SolunarPeriodsInput } from "../schema/types";
import { clamp } from "./math";

export type DiurnalBonusWindow = {
  startHour: number | string;
  endHour: number | string;
  peakBonus?: number;
};

export type DiurnalModifierConfig = {
  windows?: DiurnalBonusWindow[];
  maxBonus?: number;
  fallbackBonus?: number;
  clamp?: { min: number; max: number };
};

export type DiurnalModifier = (
  hourLocal: number | string,
  temperature?: number
) => number;

const normalizeHour = (hour: number) => ((hour % 24) + 24) % 24;

const parseHourLike = (value: number | string) => {
  if (typeof value === "string") {
    const cleaned = value.trim();
    const hhmmMatch = cleaned.match(/^(\d{1,2})(?::?(\d{2}))?$/);
    if (hhmmMatch) {
      const hours = Number(hhmmMatch[1]);
      const minutes = Number(hhmmMatch[2] ?? 0);
      return hours + minutes / 60;
    }
    const numeric = Number(cleaned);
    if (Number.isFinite(numeric)) return parseHourLike(numeric);
    return NaN;
  }

  if (!Number.isFinite(value)) return NaN;
  const abs = Math.abs(value);
  // Accept HHmm formats (e.g., 730, 1630) by converting to decimal hours
  if (abs >= 100) {
    const hours = Math.floor(abs / 100);
    const minutes = abs % 100;
    return Math.sign(value) * (hours + minutes / 60);
  }
  return value;
};

const computeTriangularBonus = (
  hour: number,
  window: DiurnalBonusWindow,
  defaultPeak: number
) => {
  const startHour = parseHourLike(window.startHour);
  const endHour = parseHourLike(window.endHour);
  if (!Number.isFinite(startHour) || !Number.isFinite(endHour)) return 0;

  const start = normalizeHour(startHour);
  const end = normalizeHour(endHour);
  if (start === end) return 0;

  // Support overnight windows by unwrapping the end past midnight when needed
  const wraps = end <= start;
  const endAdjusted = wraps ? end + 24 : end;

  let t = normalizeHour(hour);
  if (wraps && t < start) t += 24;
  if (t < start || t > endAdjusted) return 0;

  const mid = (start + endAdjusted) / 2;
  const half = endAdjusted - mid;
  const dist = Math.abs(t - mid);
  const peak = window.peakBonus ?? defaultPeak;

  return clamp(1 - dist / half, 0, 1) * peak;
};

export const buildDiurnalModifier = (
  config: DiurnalModifierConfig
): DiurnalModifier => {
  const windows = config.windows ?? [];
  const maxBonus = config.maxBonus ?? 10;
  const fallbackBonus = config.fallbackBonus ?? 0;
  const clampBounds = {
    min: config.clamp?.min ?? 0,
    max: config.clamp?.max ?? maxBonus,
  };

  return (hourLocal: number | string) => {
    const parsedHour = parseHourLike(hourLocal);
    if (!Number.isFinite(parsedHour)) {
      return clamp(fallbackBonus, clampBounds.min, clampBounds.max);
    }

    const h = normalizeHour(parsedHour);
    const bonus = windows.reduce(
      (acc, window) =>
        Math.max(acc, computeTriangularBonus(h, window, maxBonus)),
      fallbackBonus
    );

    return clamp(bonus, clampBounds.min, clampBounds.max);
  };
};

export const buildSunWindows = (
  solunar?: SolunarPeriodsInput,
  spanHours = 4,
  peakOffsetHours = 2,
  peakBonus = 5
): DiurnalBonusWindow[] | undefined => {
  if (!solunar) return undefined;
  const windows: DiurnalBonusWindow[] = [];
  const halfSpan = spanHours / 2;

  if (Number.isFinite(solunar.sunRiseDec)) {
    const rise = solunar.sunRiseDec as number;
    const peak = rise + peakOffsetHours;
    windows.push({
      startHour: peak - halfSpan,
      endHour: peak + halfSpan,
      peakBonus,
    });
  }

  if (Number.isFinite(solunar.sunSetDec)) {
    const set = solunar.sunSetDec as number;
    const peak = set - peakOffsetHours;
    windows.push({
      startHour: peak - halfSpan,
      endHour: peak + halfSpan,
      peakBonus,
    });
  }

  return windows.length ? windows : undefined;
};
