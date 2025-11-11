export type WeatherData = Readonly<{
  time: string;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  probability: number;
  rain: number;
  showers: number;
  total: number;
}>;

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
  return Object.freeze({
    time: props.time,
    temperature: props.temperature,
    humidity: props.humidity,
    pressure: props.pressure,
    windSpeed: props.windSpeed,
    probability: props.probability,
    rain: props.rain,
    showers: props.showers,
    total: props.total,
  });
}
