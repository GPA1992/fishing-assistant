import type { RangeBlockConfig } from "../core/range";
import type { DiurnalModifierConfig } from "../core/modifiers";

export type SpeciesId = string;

export type NumericClamp = { min: number; max: number };

export type RangeScoreConfig = {
  ranges: RangeBlockConfig[];
  clamp?: NumericClamp;
  fallback?: number;
  round?: boolean;
};

export type TrendAdjustConfig = {
  fall?: { limit: number; maxBonus: number };
  rise?: { limit: number; maxPenalty: number };
};

export type RainContextInput = {
  volume: number;
  probability: number;
  showers: number;
  temperature: number;
  humidity: number;
  wind: number;
};

export type ScalarCondition = {
  min?: number;
  max?: number;
  lt?: number;
  lte?: number;
  gt?: number;
  gte?: number;
  equals?: number;
};

export type RainConditionDescriptor = Partial<
  Record<keyof RainContextInput, ScalarCondition>
> & {
  warm?: boolean;
  hot?: boolean;
  cold?: boolean;
};

export type RangeValueSource = {
  type: "range";
  field: keyof RainContextInput;
  ranges: RangeBlockConfig[];
  clamp?: NumericClamp;
  fallback?: number;
};

export type NumericValueSource =
  | { type: "constant"; value: number }
  | RangeValueSource;

export type RainRule = {
  name?: string;
  when: RainConditionDescriptor;
  action: "set" | "max" | "min" | "scale";
  value: NumericValueSource;
};

export type TemperatureBandConfig = {
  warm?: { min: number; max: number };
  hot?: { min: number };
  cold?: { max: number };
};

export type RainScoreConfig = {
  baseRules: RainRule[];
  modifiers?: RainRule[];
  temperatureBands?: TemperatureBandConfig;
  clamp?: NumericClamp;
};

export type SpeciesWeightsConfig = {
  temperature: number;
  humidity: number;
  pressure: number;
  wind: number;
  rain: number;
};

export type MoonBonusMode = "center-peaks" | "edge-peaks";

export type MoonBonusConfig = {
  maxBonus: number;
  mode?: MoonBonusMode;
};

export type SolunarPeriodsInput = {
  major1StartDec?: number;
  major1StopDec?: number;
  major2StartDec?: number;
  major2StopDec?: number;
  minor1StartDec?: number;
  minor1StopDec?: number;
  minor2StartDec?: number;
  minor2StopDec?: number;
  moonIllumination?: number;
};

export type SolunarBonusConfig = {
  majorWeight: number;
  minorWeight: number;
  maxBonus: number;
};

export type ScoreComputationInput = {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  probability: number;
  total: number;
  showers: number;
  localHour?: number;
  localHourDec?: number;
  pressureTrend6h?: number;
  solunarPeriodsData?: SolunarPeriodsInput;
  moonIllumination?: number;
};

export type ScoreBreakdown = {
  temperature: number;
  humidity: number;
  pressure: number;
  wind: number;
  rain: number;
};

export type ScoreComputationResult = {
  hourlyScore: number;
  breakdown: ScoreBreakdown;
  moonBonus: number;
  solunarBonus: number;
};

export type SpeciesScoreConfig = {
  id: SpeciesId;
  weights: SpeciesWeightsConfig;
  activeVariables?: (keyof ScoreBreakdown)[];
  passiveVariables?: (keyof ScoreBreakdown)[];
  temperature: RangeScoreConfig;
  humidity: RangeScoreConfig;
  pressure: RangeScoreConfig & { trend?: TrendAdjustConfig };
  wind: RangeScoreConfig;
  rain: RainScoreConfig;
  diurnal: DiurnalModifierConfig;
  moonBonus?: MoonBonusConfig;
  solunarBonus?: SolunarBonusConfig;
  bonusCap?: number;
  precision?: number;
};
