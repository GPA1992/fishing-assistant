import { fetchWeatherApi } from "openmeteo";

import { RainData } from "../domain/rain-data.entity";
import { WeatherQueryParams } from "../contracts/in/contracts.in.params";
import { HourlyResponseData } from "../contracts/in/contracts.in.response";

export function getRainDataFunc() {
  const apiUrl = "https://api.open-meteo.com/v1/forecast";
  return async function getRainData(
    params: WeatherQueryParams
  ): Promise<HourlyResponseData<RainData>> {
    const requestParams = {
      latitude: params.latitude,
      longitude: params.longitude,
      hourly: ["precipitation_probability", "precipitation", "rain", "showers"],
    };

    const responses = await fetchWeatherApi(apiUrl, requestParams);
    const response = responses[0];
    const hourly = response.hourly();
    const utcOffsetSeconds = response.utcOffsetSeconds();

    if (!hourly) {
      throw new Error("Dados de precipitação não disponíveis");
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

    const targetHour = params.datetime.getUTCHours();
    const index = times.findIndex(
      (t) => new Date(t).getUTCHours() === targetHour
    );

    if (index === -1) {
      throw new Error("Hora alvo não encontrada nos dados");
    }

    return {
      hourly: hourlyData,
      targetHour: hourlyData[index],
    };
  };
}
