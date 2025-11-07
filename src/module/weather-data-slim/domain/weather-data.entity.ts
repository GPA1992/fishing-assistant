export type WeatherData = Readonly<{
  time: string;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
}>;

export function makeWeatherData(props: {
  time: string;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
}): WeatherData {
  return Object.freeze({
    time: props.time,
    temperature: props.temperature,
    humidity: props.humidity,
    pressure: props.pressure,
    windSpeed: props.windSpeed,
  });
}
