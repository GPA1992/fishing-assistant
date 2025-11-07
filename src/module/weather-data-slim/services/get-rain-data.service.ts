import { WeatherQueryParams } from "../contracts/in/contracts.in.params";
import { HourlyResponseData } from "../contracts/in/contracts.in.response";
import { RainData } from "../domain/rain-data.entity";
import { OpenMeteoPort } from "../domain/weather-data.port";

type GetRainData = (
  params: WeatherQueryParams
) => Promise<HourlyResponseData<RainData>>;

export function getRainDataService(openMeteoPort: OpenMeteoPort): GetRainData {
  return async function getRainData(
    params: WeatherQueryParams
  ): Promise<HourlyResponseData<RainData>> {
    return openMeteoPort.getRainData(params);
  };
}
