import { environmentDataByFish } from "../../../shared/environment-data";

export type WeatherData = Readonly<{
  time: string;
  temperature: { value: number; score: number };
  humidity: { value: number; score: number };
  pressure: { value: number; score: number };
  windSpeed: { value: number; score: number };
  rain: {
    probability: number;
    rain: number;
    showers: number;
    total: number;
    rainScore: number;
  };
  hourlyScore: number;
}>;

const { climaticConditionsCalc, rainCalc } =
  environmentDataByFish["traira"].calcScoreFunctions;

const WEIGHTS = {
  temperature: 0.4,
  pressure: 0.3,
  humidity: 0.1,
  wind: 0.2,
  rain: 0.25,
} as const;

export function makeWeatherData(props: {
  time: string;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  probability: number;
  total: number;
  rain: number;
  showers: number;
}): WeatherData {
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
    time: props.time,
    temperature: {
      value: props.temperature,
      score: tempScore,
    },
    humidity: {
      value: props.humidity,
      score: humidityScore,
    },
    pressure: {
      value: props.pressure,
      score: pressureScore,
    },
    windSpeed: {
      value: props.windSpeed,
      score: windScore,
    },
    rain: {
      probability: props.probability,
      rain: props.rain,
      showers: props.showers,
      total: props.total,
      rainScore: rainScore,
    },
    hourlyScore: hourlyScore,
  });
}
