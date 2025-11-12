// adapters/out/open-meteo/open-meteo.provider.ts

import { OpenMeteoPort } from "../domain/weather-data.port";
import { getAllWeatherDataFunc } from "./get-all-weather-data";

export function openMeteoProvider(): OpenMeteoPort {
  return {
    getAllWeatherData: getAllWeatherDataFunc(),
  };
}
