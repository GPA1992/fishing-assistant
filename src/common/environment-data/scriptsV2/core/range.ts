import { smoothLerp, clamp } from "./math";

export type RangeBlockConfig = {
  min: number;
  max?: number;
  scoreStart: number;
  scoreEnd: number;
  curve?: "smooth" | "linear" | "step";
};

export type RangeEvaluateOptions = {
  defaultValue?: number;
  clampBounds?: { min: number; max: number };
};

export const evaluateRangeBlocks = (
  value: number,
  ranges: RangeBlockConfig[],
  options: RangeEvaluateOptions = {}
): number => {
  for (const block of ranges) {
    const min = block.min ?? Number.NEGATIVE_INFINITY;
    const max = block.max ?? Number.POSITIVE_INFINITY;

    if (value < min) continue;
    if (value > max) continue;

    if (!Number.isFinite(max) || max === min) {
      return clampResult(block.scoreEnd);
    }

    const curve = block.curve ?? "smooth";
    const result = smoothLerp(value, min, max, block.scoreStart, block.scoreEnd, curve);
    return clampResult(result);
  }

  return clampResult(options.defaultValue ?? 0);

  function clampResult(result: number): number {
    if (options.clampBounds) {
      return clamp(result, options.clampBounds.min, options.clampBounds.max);
    }
    return result;
  }
};
