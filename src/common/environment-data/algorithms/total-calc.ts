import { clamp, smoothLerp } from ".";
import { calcFuncBySpecie } from "..";
import { fishList, TotalCalcParams, TotalCalcResult } from "../types";

const WEIGHTS = {
  temperature: 0.32,
  pressure: 0.24,
  wind: 0.19,
  rain: 0.2, // mais impacto quando realmente há chuva
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
  let hourlyScore =
    (tempScore + humidityScore + pressureScoreW + windScoreW + rainScoreW) /
    sumW;

  const mod = diurnalModifier(props.localHour, props.sixHourTemp);
  hourlyScore = Math.round(clamp(hourlyScore * mod, 0, 100) * 1000) / 1000;

  return Object.freeze({
    tempScore,
    humidityScore,
    pressureScore: pressureScoreW,
    windScore: windScoreW,
    rainScore: rainScoreW,
    hourlyScore,
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

// data[i] é { time, temperature, ... }
// janela: tamanho ímpar (3, 5, 7...). Borda usa menos pontos automaticamente.
export function mediaMovelCentradaObj<T>(
  data: T[],
  indice: number,
  janela: number,
  selecionar: (row: T) => number
): number {
  const tamanho = data.length;
  if (tamanho === 0) return NaN;

  const largura = Math.max(1, janela | 0);
  const impar = largura % 2 === 1 ? largura : largura + 1; // força ímpar
  const metade = Math.floor(impar / 2);

  const inicio = Math.max(0, indice - metade);
  const fim = Math.min(tamanho - 1, indice + metade);

  let soma = 0;
  let cont = 0;
  for (let k = inicio; k <= fim; k++) {
    const v = selecionar(data[k]);
    if (Number.isFinite(v)) {
      soma += v;
      cont++;
    }
  }
  return cont ? soma / cont : selecionar(data[indice]);
}
