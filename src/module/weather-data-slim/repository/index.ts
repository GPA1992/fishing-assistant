// adapters/out/open-meteo/open-meteo.provider.ts

import { OpenMeteoPort } from "../domain/weather-data.port";
import { getAllWeatherDataFunc } from "./get-all-weather-data";
import { getRainDataFunc } from "./get-rain-data";

export function openMeteoProvider(): OpenMeteoPort {
  return {
    getAllWeatherData: getAllWeatherDataFunc(),
    getRainData: getRainDataFunc(),
  };
}
