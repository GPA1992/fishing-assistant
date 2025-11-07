import { WeatherQueryParams } from "../contracts/in/contracts.in.params";
import { HourlyResponseData } from "../contracts/in/contracts.in.response";
import { RainData } from "./rain-data.entity";
import { WeatherData } from "./weather-data.entity";

export type OpenMeteoPort = {
  getRainData: (
    params: WeatherQueryParams
  ) => Promise<HourlyResponseData<RainData>>;
  getAllWeatherData: (
    params: WeatherQueryParams
  ) => Promise<HourlyResponseData<WeatherData>>;
};
