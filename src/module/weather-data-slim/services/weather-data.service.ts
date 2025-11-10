import { environmentDataByFish } from "../../../shared/environment-data";
import { WeatherQueryParams } from "../contracts/in/contracts.in.params";
import { HourlyResponseData } from "../contracts/in/contracts.in.response";
import { WeatherData } from "../domain/weather-data.entity";
import { OpenMeteoPort } from "../domain/weather-data.port";

type GetAllWeatherData = (
  params: WeatherQueryParams
) => Promise<HourlyResponseData<WeatherData>>;

export function getAllWeatherDataService(
  openMeteoPort: OpenMeteoPort
): GetAllWeatherData {
  return async function getAllWeatherData(
    params: WeatherQueryParams
  ): Promise<HourlyResponseData<WeatherData>> {
    return openMeteoPort.getAllWeatherData(params);
  };
}
