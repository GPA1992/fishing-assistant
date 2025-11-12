import { WeatherQueryParams } from "../contracts/in/contracts.in.params";
import { HourlyResponseData } from "../contracts/in/contracts.in.response";
import { WeatherData } from "./weather-data.entity";

export type OpenMeteoPort = {
  getAllWeatherData: (
    params: WeatherQueryParams
  ) => Promise<HourlyResponseData<WeatherData>>;
};
