import { fetchWeatherApi } from "openmeteo";
import { WeatherData } from "../domain/weather-data.entity";
import { WeatherQueryParams } from "../contracts/in/contracts.in.params";
import { HourlyResponseData } from "../contracts/in/contracts.in.response";

export function getAllWeatherDataFunc() {
  const apiUrl = "https://api.open-meteo.com/v1/forecast";
  return async function getAllWeatherData(
    params: WeatherQueryParams
  ): Promise<HourlyResponseData<WeatherData>> {
    // garanta que params.datetime está preenchido com o dia/mês/ano/UTC corretos
    const y = params.datetime.getUTCFullYear();
    const m = String(params.datetime.getUTCMonth() + 1).padStart(2, "0");
    const d = String(params.datetime.getUTCDate()).padStart(2, "0");

    const requestParams = {
      latitude: params.latitude,
      longitude: params.longitude,
      start_date: `${y}-${m}-${d}`,
      end_date: `${y}-${m}-${d}`,
      hourly: [
        "temperature_2m",
        "relative_humidity_2m",
        "surface_pressure",
        "wind_speed_10m",
      ],
    };

    const responses = await fetchWeatherApi(apiUrl, requestParams);

    const response = responses[0];
    const hourly = response.hourly();

    if (!hourly) {
      throw new Error("Dados meteorológicos não disponíveis");
    }

    const timeStart = Number(hourly.time()); // epoch em segundos (UTC)
    const timeEnd = Number(hourly.timeEnd());
    const interval = hourly.interval();

    // timestamps em UTC (sem aplicar utcOffsetSeconds)
    const times = Array.from({ length: (timeEnd - timeStart) / interval }).map(
      (_, i) => new Date((timeStart + i * interval) * 1000).toISOString()
    );

    const temperature = hourly.variables(0)?.valuesArray() ?? [];
    const humidity = hourly.variables(1)?.valuesArray() ?? [];
    const pressure = hourly.variables(2)?.valuesArray() ?? [];
    const windSpeed = hourly.variables(3)?.valuesArray() ?? [];

    const round2 = (x: number) => Math.round((x + Number.EPSILON) * 100) / 100;

    const hourlyData: WeatherData[] = times.map((time, i) => ({
      time,
      temperature: round2(temperature[i]),
      humidity: round2(humidity[i]),
      pressure: round2(pressure[i]),
      windSpeed: round2(windSpeed[i]),
    }));

    // match por data+hora exata em UTC
    const targetMs = Date.UTC(
      y,
      params.datetime.getUTCMonth(),
      params.datetime.getUTCDate(),
      params.datetime.getUTCHours(),
      0,
      0,
      0
    );
    const index = times.findIndex((t) => new Date(t).getTime() === targetMs);

    return {
      hourly: hourlyData,
      targetHour: hourlyData[index],
    };
  };
}
