import { fetchWeatherApi } from "openmeteo";

import { RainData } from "../domain/rain-data.entity";
import { WeatherQueryParams } from "../contracts/in/contracts.in.params";
import { HourlyResponseData } from "../contracts/in/contracts.in.response";

export function getRainDataFunc() {
  const apiUrl = "https://api.open-meteo.com/v1/forecast";
  return async function getRainData(
    params: WeatherQueryParams
  ): Promise<HourlyResponseData<RainData>> {
    const y = params.datetime.getUTCFullYear();
    const m = String(params.datetime.getUTCMonth() + 1).padStart(2, "0");
    const d = String(params.datetime.getUTCDate()).padStart(2, "0");

    const requestParams = {
      latitude: params.latitude,
      longitude: params.longitude,
      start_date: `${y}-${m}-${d}`,
      end_date: `${y}-${m}-${d}`,
      hourly: ["precipitation_probability", "precipitation", "rain", "showers"],
    };

    const responses = await fetchWeatherApi(apiUrl, requestParams);

    const response = responses[0];

    const hourly = response.hourly();

    if (!hourly) {
      throw new Error("Dados meteorológicos não disponíveis");
    }

    const timeStart = Number(hourly.time());
    const timeEnd = Number(hourly.timeEnd());

    const interval = hourly.interval();
    const times = Array.from({ length: (timeEnd - timeStart) / interval }).map(
      (_, i) => new Date((timeStart + i * interval) * 1000).toISOString()
    );

    const probability = hourly.variables(0)?.valuesArray() ?? [];
    const total = hourly.variables(1)?.valuesArray() ?? [];
    const rain = hourly.variables(2)?.valuesArray() ?? [];
    const showers = hourly.variables(3)?.valuesArray() ?? [];

    const hourlyData: RainData[] = times.map((time, i) => ({
      time,
      probability: probability[i],
      total: total[i],
      rain: rain[i],
      showers: showers[i],
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
