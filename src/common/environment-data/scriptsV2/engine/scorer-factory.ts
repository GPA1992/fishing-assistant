import { clamp } from "../core/math";
import { evaluateRangeBlocks } from "../core/range";
import type {
  NumericValueSource,
  RainConditionDescriptor,
  RainContextInput,
  RainRule,
  RainScoreConfig,
  RangeScoreConfig,
  ScalarCondition,
  TrendAdjustConfig,
  TemperatureBandConfig,
} from "../schema/types";

type RangeScorer = (value: number) => number;
type TrendScorer = (value: number, trend?: number) => number;
type RainScorer = (context: RainContextInput) => number;

type RainContextState = RainContextInput & {
  warm: boolean;
  hot: boolean;
  cold: boolean;
};

export const createRangeScorer = (config: RangeScoreConfig): RangeScorer => {
  const fallback = config.fallback ?? 0;
  const clampBounds = config.clamp;
  const shouldRound = config.round !== false;

  return (value: number) => {
    const evaluated = evaluateRangeBlocks(value, config.ranges, {
      defaultValue: fallback,
      clampBounds,
    });
    const bounded = clampBounds
      ? clamp(evaluated, clampBounds.min, clampBounds.max)
      : evaluated;
    return shouldRound ? Math.round(bounded) : bounded;
  };
};

export const createTrendAdjustedScorer = (
  config: RangeScoreConfig & { trend?: TrendAdjustConfig }
): TrendScorer => {
  const baseEvaluator = (value: number) =>
    evaluateRangeBlocks(value, config.ranges, {
      defaultValue: config.fallback ?? 0,
      clampBounds: config.clamp,
    });
  const clampBounds = config.clamp ?? { min: 0, max: 100 };
  const shouldRound = config.round !== false;
  const trend = config.trend;

  return (value: number, trendDelta?: number) => {
    let base = baseEvaluator(value);

    if (trend && typeof trendDelta === "number") {
      if (trend.fall) {
        const fallMagnitude = clamp(-trendDelta, 0, trend.fall.limit);
        const bonus = (fallMagnitude / trend.fall.limit) * trend.fall.maxBonus;
        base += bonus;
      }
      if (trend.rise) {
        const riseMagnitude = clamp(trendDelta, 0, trend.rise.limit);
        const malus =
          (riseMagnitude / trend.rise.limit) * trend.rise.maxPenalty;
        base -= malus;
      }
    }

    const bounded = clamp(base, clampBounds.min, clampBounds.max);
    return shouldRound ? Math.round(bounded) : bounded;
  };
};

const defaultBands: TemperatureBandConfig = {
  warm: { min: 24, max: 32 },
  hot: { min: 32 },
  cold: { max: 20 },
};

const resolveScalar = (value: number, cond?: ScalarCondition) => {
  if (!cond) return true;
  if (typeof cond.equals === "number" && value !== cond.equals) return false;
  if (typeof cond.min === "number" && value < cond.min) return false;
  if (typeof cond.max === "number" && value > cond.max) return false;
  if (typeof cond.lt === "number" && !(value < cond.lt)) return false;
  if (typeof cond.lte === "number" && !(value <= cond.lte)) return false;
  if (typeof cond.gt === "number" && !(value > cond.gt)) return false;
  if (typeof cond.gte === "number" && !(value >= cond.gte)) return false;
  return true;
};

const matchesCondition = (
  ctx: RainContextState,
  cond: RainConditionDescriptor
) => {
  if (!cond) return true;
  const entries: [keyof RainContextInput, ScalarCondition | undefined][] = [
    ["volume", cond.volume],
    ["probability", cond.probability],
    ["showers", cond.showers],
    ["temperature", cond.temperature],
    ["humidity", cond.humidity],
    ["wind", cond.wind],
  ];
  for (const [field, descriptor] of entries) {
    if (!resolveScalar(ctx[field], descriptor)) return false;
  }
  if (typeof cond.warm === "boolean" && ctx.warm !== cond.warm) return false;
  if (typeof cond.hot === "boolean" && ctx.hot !== cond.hot) return false;
  if (typeof cond.cold === "boolean" && ctx.cold !== cond.cold) return false;
  return true;
};

const resolveNumericSource = (
  ctx: RainContextState,
  source: NumericValueSource
): number => {
  if (source.type === "constant") return source.value;
  const baseValue = ctx[source.field];
  return evaluateRangeBlocks(baseValue, source.ranges, {
    clampBounds: source.clamp,
    defaultValue: source.fallback ?? baseValue,
  });
};

const buildContextState = (
  input: RainContextInput,
  bands: TemperatureBandConfig = defaultBands
): RainContextState => {
  const warm =
    bands.warm !== undefined &&
    input.temperature >= (bands.warm.min ?? Number.NEGATIVE_INFINITY) &&
    input.temperature <= (bands.warm.max ?? Number.POSITIVE_INFINITY);
  const hot =
    bands.hot !== undefined &&
    input.temperature >= (bands.hot.min ?? Number.NEGATIVE_INFINITY);
  const cold =
    bands.cold !== undefined &&
    input.temperature <= (bands.cold.max ?? Number.POSITIVE_INFINITY);

  return {
    ...input,
    warm,
    hot,
    cold,
  };
};

const applyRainRules = (
  rules: RainRule[] | undefined,
  ctx: RainContextState,
  currentScore: number | undefined,
  stopAfterFirstSet: boolean
): number => {
  let score = currentScore ?? 0;
  if (!rules?.length) return score;

  for (const rule of rules) {
    if (!matchesCondition(ctx, rule.when)) continue;
    const value = resolveNumericSource(ctx, rule.value);

    switch (rule.action) {
      case "set":
        score = value;
        if (stopAfterFirstSet) return score;
        break;
      case "max":
        score = Math.max(score, value);
        break;
      case "min":
        score = Math.min(score, value);
        break;
      case "scale":
        score = score * value;
        break;
    }
  }

  return score;
};

export const createRainScorer = (config: RainScoreConfig): RainScorer => {
  const clampBounds = config.clamp ?? { min: 0, max: 100 };
  return (context: RainContextInput) => {
    const ctx = buildContextState(context, {
      ...defaultBands,
      ...config.temperatureBands,
    });
    let score = applyRainRules(config.baseRules, ctx, undefined, true);
    score = applyRainRules(config.modifiers, ctx, score, false);
    score = clamp(score, clampBounds.min, clampBounds.max);
    return Math.round(score);
  };
};
