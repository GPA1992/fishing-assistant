import { calcFuncBySpecie } from "../../../shared/environment-data";
import { fishList, TotalCalcParams, TotalCalcResult } from "../types";

const WEIGHTS = {
  temperature: 0.4,
  pressure: 0.3,
  humidity: 0.1,
  wind: 0.2,
  rain: 0.25,
} as const;

export const calcFinalScore = (
  props: TotalCalcParams,
  fish: fishList
): TotalCalcResult => {
  const { climaticConditionsCalc, rainCalc } = calcFuncBySpecie[fish];

  const tempScore =
    climaticConditionsCalc.temperatureScore(props.temperature) *
    WEIGHTS.temperature;
  const humidityScore =
    climaticConditionsCalc.humidityScore(props.humidity) * WEIGHTS.humidity;
  const pressureScore =
    climaticConditionsCalc.pressureScore(props.pressure) * WEIGHTS.pressure;
  const windScore =
    climaticConditionsCalc.windScore(props.windSpeed) * WEIGHTS.wind;
  const rainScore =
    rainCalc.rainScore({
      humidityPct: props.humidity,
      pressure: props.pressure,
      windSpeed: props.windSpeed,
      rainProbability: props.probability,
      showerVolumeMmPerHour: props.showers,
      temperatureC: props.temperature,
      volumeMmPerHour: props.total,
    }) * WEIGHTS.rain;

  const sumWeights =
    WEIGHTS.temperature +
    WEIGHTS.pressure +
    WEIGHTS.wind +
    WEIGHTS.humidity +
    WEIGHTS.rain;

  const hourlyScore =
    (tempScore + humidityScore + pressureScore + windScore + rainScore) /
    sumWeights;

  return Object.freeze({
    tempScore,
    humidityScore,
    pressureScore,
    windScore,
    rainScore,
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
