import { clamp } from "../core/math";
import { buildDiurnalModifier } from "../core/modifiers";
import { triangularPeakAtCenter } from "../core/temporal";
import {
  ScoreComputationInput,
  ScoreComputationResult,
  ScoreBreakdown,
  SpeciesScoreConfig,
  SolunarPeriodsInput,
  MoonBonusConfig,
  SolunarBonusConfig,
} from "../schema/types";
import {
  createRainScorer,
  createRangeScorer,
  createTrendAdjustedScorer,
} from "./scorer-factory";

export type SpeciesCalculator = {
  id: string;
  calculate: (input: ScoreComputationInput) => ScoreComputationResult;
};

const computeMoonBonus = (
  illumination: number | undefined,
  config?: MoonBonusConfig
): number => {
  if (!config || typeof illumination !== "number") return 0;
  const v = clamp(illumination, 0, 1);
  let normalized = 0;

  switch (config.mode ?? "center-peaks") {
    case "edge-peaks":
      normalized = 4 * Math.pow(v - 0.5, 2);
      break;
    case "center-peaks":
    default:
      normalized = 1 - 4 * Math.pow(v - 0.5, 2);
      break;
  }

  return clamp(normalized * config.maxBonus, 0, config.maxBonus);
};

const computeSolunarBonus = (
  data: SolunarPeriodsInput | undefined,
  hourDec: number | undefined,
  config?: SolunarBonusConfig
): number => {
  if (!config) return 0;
  if (!data) return 0;
  if (typeof hourDec !== "number") return 0;

  const majors = [
    triangularPeakAtCenter(hourDec, data.major1StartDec, data.major1StopDec),
    triangularPeakAtCenter(hourDec, data.major2StartDec, data.major2StopDec),
  ];
  const minors = [
    triangularPeakAtCenter(hourDec, data.minor1StartDec, data.minor1StopDec),
    triangularPeakAtCenter(hourDec, data.minor2StartDec, data.minor2StopDec),
  ];

  const majorSum = majors.reduce((acc, val) => acc + val, 0);
  const minorSum = minors.reduce((acc, val) => acc + val, 0);
  const bonus =
    majorSum * config.majorWeight + minorSum * config.minorWeight;
  return clamp(bonus, 0, config.maxBonus);
};

export const buildSpeciesCalculator = (
  config: SpeciesScoreConfig
): SpeciesCalculator => {
  const temperatureScore = createRangeScorer(config.temperature);
  const humidityScore = createRangeScorer(config.humidity);
  const pressureScore = createTrendAdjustedScorer(config.pressure);
  const windScore = createRangeScorer(config.wind);
  const rainScore = createRainScorer(config.rain);
  const diurnal = buildDiurnalModifier(config.diurnal);
  const activeVars = config.activeVariables ?? ["temperature", "wind", "rain"];
  const passiveVars = config.passiveVariables ?? ["humidity", "pressure"];
  const sumWeights = Object.values(config.weights).reduce(
    (acc, val) => acc + val,
    0
  );
  const bonusCap = config.bonusCap ?? 8;
  const precision = config.precision ?? 3;
  const precisionFactor = Math.pow(10, precision);

  return {
    id: config.id,
    calculate: (input: ScoreComputationInput) => {
      const tempRaw = temperatureScore(input.temperature);
      const humidityRaw = humidityScore(input.humidity);
      const pressureRaw = pressureScore(
        input.pressure,
        input.pressureTrend6h
      );
      const windRaw = windScore(input.windSpeed);
      const rainRaw = rainScore({
        volume: Math.max(0, input.total),
        probability: clamp(input.probability, 0, 100),
        showers: Math.max(0, input.showers),
        temperature: input.temperature,
        humidity: clamp(input.humidity, 0, 100),
        wind: Math.max(0, input.windSpeed),
      });

      const breakdown: ScoreBreakdown = {
        temperature: tempRaw * config.weights.temperature,
        humidity: humidityRaw * config.weights.humidity,
        pressure: pressureRaw * config.weights.pressure,
        wind: windRaw * config.weights.wind,
        rain: rainRaw * config.weights.rain,
      };

      const diurnalFactor = diurnal(input.localHour ?? 12, input.temperature);
      const activePart =
        activeVars.reduce((acc, key) => acc + breakdown[key], 0) * diurnalFactor;
      const passivePart = passiveVars.reduce(
        (acc, key) => acc + breakdown[key],
        0
      );
      let hourlyScore = (activePart + passivePart) / sumWeights;

      const moonIllum =
        typeof input.moonIllumination === "number"
          ? input.moonIllumination
          : input.solunarPeriodsData?.moonIllumination;

      const moonBonus = computeMoonBonus(moonIllum, config.moonBonus);
      const solunarBonus = computeSolunarBonus(
        input.solunarPeriodsData,
        input.localHourDec,
        config.solunarBonus
      );
      const combinedBonus = Math.min(moonBonus + solunarBonus, bonusCap);

      hourlyScore = clamp(hourlyScore + combinedBonus, 0, 100);
      hourlyScore = Math.round(hourlyScore * precisionFactor) / precisionFactor;

      return {
        hourlyScore,
        breakdown,
        moonBonus,
        solunarBonus,
      };
    },
  };
};
