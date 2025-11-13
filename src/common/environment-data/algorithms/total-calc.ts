import { clamp, smoothLerp } from "./math";
import { calcFuncBySpecie } from "..";
import { fishList, TotalCalcParams, TotalCalcResult } from "../types";
import {
  computeMoonBonusPoints,
  computeSolunarBonusPoints,
} from "@env-data/traira/scorers/sololunar";

const WEIGHTS = {
  temperature: 0.32,
  pressure: 0.24,
  wind: 0.19,
  rain: 0.2,
  humidity: 0.05,
} as const;

function thermalSuitability(tempC: number): number {
  if (tempC <= 18) return 0.3;
  if (tempC < 22) return smoothLerp(tempC, 18, 22, 0.3, 0.7);
  if (tempC < 26) return smoothLerp(tempC, 22, 26, 0.7, 1.0);
  if (tempC < 30) return smoothLerp(tempC, 26, 30, 1.0, 0.7);
  if (tempC < 34) return smoothLerp(tempC, 30, 34, 0.7, 0.4);
  return 0.3;
}

export function diurnalModifier(localHour: number, tempC?: number): number {
  const h = ((localHour % 24) + 24) % 24;
  const aBase = 0.05; // ±6% máximo
  const a = aBase * (tempC ? thermalSuitability(tempC) : 1); // reduz no calor
  const m = 1 - a * Math.cos(((h - 12) * Math.PI) / 6);
  return clamp(m, 1 - a, 1 + a);
}
export const calcFinalScore = (
  props: TotalCalcParams,
  fish: fishList
): TotalCalcResult => {
  const { climaticConditionsCalc, rainCalc } = calcFuncBySpecie[fish];

  const tRaw = climaticConditionsCalc.temperatureScore(props.temperature);
  const hRaw = climaticConditionsCalc.humidityScore(props.humidity);
  const pRaw = climaticConditionsCalc.pressureScore(
    props.pressure,
    props.pressureTrend6h
  );
  const wRaw = climaticConditionsCalc.windScore(props.windSpeed);
  const rRaw = rainCalc.rainScore({
    humidityPct: props.humidity,
    pressure: props.pressure,
    windSpeed: props.windSpeed,
    rainProbability: props.probability,
    showerVolumeMmPerHour: props.showers,
    temperatureC: props.temperature,
    volumeMmPerHour: props.total,
  });

  const tempScore = tRaw * WEIGHTS.temperature;
  const humidityScore = hRaw * WEIGHTS.humidity;
  const pressureScoreW = pRaw * WEIGHTS.pressure;
  const windScoreW = wRaw * WEIGHTS.wind;
  const rainScoreW = rRaw * WEIGHTS.rain;

  const sumW =
    WEIGHTS.temperature +
    WEIGHTS.pressure +
    WEIGHTS.wind +
    WEIGHTS.humidity +
    WEIGHTS.rain;

  const diurnal = diurnalModifier(props.localHour ?? 12, props.temperature);
  const activePart = (tempScore + windScoreW + rainScoreW) * diurnal;
  const passivePart = humidityScore + pressureScoreW;

  const hourDec = props.localHourDec;
  const moonBonus = computeMoonBonusPoints(
    props.solunarPeriodsData?.moonIllumination
  );

  const solunarBonus = props.solunarPeriodsData
    ? computeSolunarBonusPoints(props.solunarPeriodsData, hourDec)
    : 0;

  // cap geral de bônus combinados: +8
  const combinedBonus = Math.min(moonBonus + solunarBonus, 8);

  let hourlyScore = (activePart + passivePart) / sumW;
  hourlyScore = clamp(hourlyScore + combinedBonus, 0, 100);
  hourlyScore = Math.round(hourlyScore * 1000) / 1000;

  return Object.freeze({
    tempScore,
    humidityScore,
    pressureScore: pressureScoreW,
    windScore: windScoreW,
    rainScore: rainScoreW,
    hourlyScore,
    moonBonus,
    solunarBonus,
  });
};
export const calculateTotalScoreBySpecie = (
  props: TotalCalcParams,
  fish: fishList[]
): Record<fishList, TotalCalcResult> => {
  let result = {} as Record<fishList, TotalCalcResult>;
  fish.forEach((specie) => {
    result[specie] = calcFinalScore(props, specie);
  });

  return result;
};
