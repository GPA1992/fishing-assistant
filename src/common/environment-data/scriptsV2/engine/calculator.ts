import { clamp } from "../core/math";
import { buildDiurnalModifier } from "../core/modifiers";
import { triangularPeakAtCenter } from "../core/temporal";
import type {
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

const isFiniteNumber = (value: number | undefined): value is number =>
  typeof value === "number" && Number.isFinite(value);

const inertiaFactor = 0.2;

const computeWaterTemp = (airTemp: number, prevWaterTemp?: number): number => {
  if (!isFiniteNumber(prevWaterTemp)) return airTemp;
  return prevWaterTemp + inertiaFactor * (airTemp - prevWaterTemp);
};

const shouldResetWaterState = (
  previousHour: number | undefined,
  currentHour: number | undefined
) => {
  if (!isFiniteNumber(previousHour) || !isFiniteNumber(currentHour))
    return true;
  return currentHour < previousHour;
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

const computeMoonPhaseWindowWeight = (
  hour: number,
  start: number,
  end: number
) => {
  if (start === end) return 1;
  const span = end - start;
  if (span <= 0) return 0;
  const center = start + span / 2;
  const halfSpan = span / 2;
  const distance = Math.abs(hour - center);
  if (distance >= halfSpan) return 0;
  return 1 - distance / halfSpan;
};

const computeWrappedWindowWeight = (
  hour: number,
  start: number,
  end: number
) => {
  if (start <= end) {
    return computeMoonPhaseWindowWeight(hour, start, end);
  }
  return Math.max(
    computeMoonPhaseWindowWeight(hour, start, 24),
    computeMoonPhaseWindowWeight(hour, 0, end)
  );
};

const normalizeHourDec = (value: number | undefined) => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return undefined;
  }
  const normalized = value % 24;
  return normalized < 0 ? normalized + 24 : normalized;
};

const computeMoonPhaseBonus = (
  illumination: number | undefined,
  hourDec: number | undefined
): number => {
  if (typeof illumination !== "number") return 0;
  const hour = normalizeHourDec(hourDec);
  if (hour === undefined) return 0;

  const clampedIllum = clamp(illumination, 0, 1);
  const phase =
    clampedIllum <= 0.25 ? "new" : clampedIllum >= 0.75 ? "full" : "quarter";

  switch (phase) {
    case "full": {
      const nightEmphasis = Math.max(
        computeWrappedWindowWeight(hour, 20, 24),
        computeWrappedWindowWeight(hour, 0, 4.5)
      );
      const morningCarry = computeWrappedWindowWeight(hour, 5, 10);
      return Math.max(nightEmphasis * 1.5, morningCarry * 1);
    }
    case "new": {
      const dawnEmphasis = computeWrappedWindowWeight(hour, 4.5, 9);
      return dawnEmphasis * 1.5;
    }
    case "quarter":
    default: {
      const dawn = computeWrappedWindowWeight(hour, 5, 9);
      const dusk = computeWrappedWindowWeight(hour, 16, 20.5);
      return Math.max(dawn, dusk) * 1.2;
    }
  }
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
  const bonus = majorSum * config.majorWeight + minorSum * config.minorWeight;
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
  let prevWaterTemp: number | undefined;
  let prevHour: number | undefined;

  return {
    id: config.id,
    calculate: (input: ScoreComputationInput) => {
      const hourForDiurnal = isFiniteNumber(input.localHourDec)
        ? input.localHourDec
        : input.localHour;
      const currentHour = isFiniteNumber(hourForDiurnal)
        ? hourForDiurnal
        : undefined;

      if (shouldResetWaterState(prevHour, currentHour)) {
        prevWaterTemp = undefined;
      }

      const airTemp = Number.isFinite(input.temperature)
        ? input.temperature
        : prevWaterTemp ?? input.temperature;
      const waterTemp = computeWaterTemp(airTemp, prevWaterTemp);
      prevWaterTemp = waterTemp;
      prevHour = currentHour;

      const tempRaw = temperatureScore(waterTemp);
      const humidityRaw = humidityScore(input.humidity);
      const pressureRaw = pressureScore(input.pressure, input.pressureTrend6h);
      const windRaw = windScore(input.windSpeed);
      const rainRaw = rainScore({
        volume: Math.max(0, input.total),
        probability: clamp(input.probability, 0, 100),
        showers: Math.max(0, input.showers),
        temperature: input.temperature,
        humidity: clamp(input.humidity, 0, 100),
        wind: Math.max(0, input.windSpeed),
      });
      const diurnalBonus = diurnal(hourForDiurnal ?? 12);

      const breakdown: ScoreBreakdown = {
        temperature: tempRaw * config.weights.temperature,
        humidity: humidityRaw * config.weights.humidity,
        pressure: pressureRaw * config.weights.pressure,
        wind: windRaw * config.weights.wind,
        rain: rainRaw * config.weights.rain,
      };

      const activePart = activeVars.reduce(
        (acc, key) => acc + breakdown[key],
        0
      );
      const passivePart = passiveVars.reduce(
        (acc, key) => acc + breakdown[key],
        0
      );
      const usedWeightSum = Array.from(
        new Set([...activeVars, ...passiveVars])
      ).reduce(
        (acc, key) =>
          acc + ((config.weights as Record<string, number>)[key] ?? 0),
        0
      );
      const divisor = usedWeightSum > 0 ? usedWeightSum : sumWeights;
      let hourlyScore = (activePart + passivePart) / divisor + diurnalBonus;

      const moonIllum =
        typeof input.moonIllumination === "number"
          ? input.moonIllumination
          : input.solunarPeriodsData?.moonIllumination;

      const moonBonus = computeMoonBonus(moonIllum, config.moonBonus);
      const solunarBonus = computeSolunarBonus(
        input.solunarPeriodsData,
        hourForDiurnal,
        config.solunarBonus
      );
      const moonPhaseBonus = computeMoonPhaseBonus(
        moonIllum,
        typeof input.localHourDec === "number"
          ? input.localHourDec
          : input.localHour
      );
      const combinedBonus = Math.min(
        moonBonus + solunarBonus + moonPhaseBonus,
        bonusCap
      );

      hourlyScore = clamp(hourlyScore + combinedBonus, 0, 100);
      hourlyScore = Math.round(hourlyScore * precisionFactor) / precisionFactor;

      return {
        hourlyScore,
        breakdown,
        moonBonus,
        solunarBonus,
        moonPhaseBonus,
        hourBonus: diurnalBonus,
      };
    },
  };
};
