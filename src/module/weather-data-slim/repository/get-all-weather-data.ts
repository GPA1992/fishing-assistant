import { fetchWeatherApi } from "openmeteo";
import { WeatherData } from "../domain/weather-data.entity";
import { WeatherQueryParams } from "../contracts/in/contracts.in.params";
import { HourlyResponseData } from "../contracts/in/contracts.in.response";

export function getAllWeatherDataFunc() {
  const apiUrl = "https://api.open-meteo.com/v1/forecast";
  return async function getAllWeatherData(
    params: WeatherQueryParams
  ): Promise<HourlyResponseData<WeatherData>> {
    const requestParams = {
      latitude: params.latitude,
      longitude: params.longitude,
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
    const utcOffsetSeconds = response.utcOffsetSeconds();

    if (!hourly) {
      throw new Error("Dados meteorológicos não disponíveis");
    }

    const timeStart = Number(hourly.time());
    const interval = hourly.interval();
    const times = Array.from({
      length: (Number(hourly.timeEnd()) - timeStart) / interval,
    }).map((_, i) =>
      new Date(
        (timeStart + i * interval + utcOffsetSeconds) * 1000
      ).toISOString()
    );

    const temperature = hourly.variables(0)?.valuesArray() ?? [];
    const humidity = hourly.variables(1)?.valuesArray() ?? [];
    const pressure = hourly.variables(2)?.valuesArray() ?? [];
    const windSpeed = hourly.variables(3)?.valuesArray() ?? [];

    const hourlyData: WeatherData[] = times.map((time, i) => ({
      time,
      temperature: temperature[i],
      humidity: humidity[i],
      pressure: pressure[i],
      windSpeed: windSpeed[i],
    }));

    const targetHour = params.datetime.getUTCHours();
    const index = times.findIndex(
      (t) => new Date(t).getUTCHours() === targetHour
    );

    return {
      hourly: hourlyData,
      targetHour: hourlyData[index],
    };
  };
}
