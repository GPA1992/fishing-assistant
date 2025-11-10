import { environmentDataByFish } from "../../../shared/environment-data";
import { getAstronomicalData } from "../../moon-phase-data/application";
import { getSoloLunarPeriods } from "../../sololunar-periods/application";
import { HourlyResponseData } from "../../weather-data-slim/contracts/in/contracts.in.response";
import {
  getAllWeatherData,
  getRainData,
} from "../../weather-data-slim/services";
import { ScoreQueryParams } from "../contracts/in/get-day-score.in.params";
import { ScoreData } from "../domain/day-score-metrics.entity";

type GetScoreData = (
  params: ScoreQueryParams
) => Promise<HourlyResponseData<ScoreData>>;

export function getScoreDayService(): GetScoreData {
  return async function geScoreData({
    datetime,
    latitude,
    longitude,
    timezone,
  }: ScoreQueryParams): Promise<HourlyResponseData<ScoreData>> {
    const raindData = getRainData({
      datetime,
      latitude,
      longitude,
    });

    const waeatherData = getAllWeatherData({
      datetime,
      latitude,
      longitude,
    });

    const sololunarData = getSoloLunarPeriods({
      date: datetime,
      latitude,
      longitude,
      timezone: Number(timezone),
    });

    const moonPhasesData = getAstronomicalData({
      datetime,
      latitude,
      longitude,
    });

    const [
      rainDataResult,
      weatherDataResult,
      sololunarDataResult,
      moonPhasesDataResult,
    ] = await Promise.all([
      raindData,
      waeatherData,
      sololunarData,
      moonPhasesData,
    ]);

    return {} as HourlyResponseData<ScoreData>;
  };
}
