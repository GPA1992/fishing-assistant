import { clamp } from "./math";
import { RangeBlockConfig, evaluateRangeBlocks } from "./range";

export type DiurnalModifierConfig = {
  amplitudeBase: number;
  temperatureRanges?: RangeBlockConfig[];
  fallbackSuitability?: number;
  clamp?: { min: number; max: number };
  referenceHour?: number;
};

export type DiurnalModifier = (hourLocal: number, temperature?: number) => number;

export const buildDiurnalModifier = (
  config: DiurnalModifierConfig
): DiurnalModifier => {
  const ref = config.referenceHour ?? 12;
  const fallbackSuitability = config.fallbackSuitability ?? 1;

  return (hourLocal: number, temperature?: number) => {
    const h = ((hourLocal % 24) + 24) % 24;
    const suitability =
      config.temperatureRanges && Number.isFinite(temperature)
        ? evaluateRangeBlocks(temperature as number, config.temperatureRanges, {
            defaultValue: fallbackSuitability,
            clampBounds: { min: 0, max: 1 },
          })
        : fallbackSuitability;

    const amplitude = (config.amplitudeBase ?? 0) * suitability;
    const raw = 1 - amplitude * Math.cos(((h - ref) * Math.PI) / 6);
    const min = config.clamp?.min ?? 1 - amplitude;
    const max = config.clamp?.max ?? 1 + amplitude;
    return clamp(raw, min, max);
  };
};
