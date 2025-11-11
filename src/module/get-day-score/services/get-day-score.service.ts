import { getSoloLunarPeriods } from "../../sololunar-periods/application";
import { HourlyResponseData } from "../../weather-data-slim/contracts/in/contracts.in.response";
import { getAllWeatherData } from "../../weather-data-slim/services";
import { ScoreQueryParams } from "../contracts/in/get-day-score.in.params";
import {
  MakeDayScoreData,
  DayScoreByFish,
} from "../domain/day-score-metrics.entity";

type GetScoreData = (
  params: ScoreQueryParams
) => Promise<HourlyResponseData<DayScoreByFish>>;

export function getScoreDayService(): GetScoreData {
  return async function geScoreData({
    datetime,
    latitude,
    longitude,
    timezone,
    fishList,
  }: ScoreQueryParams): Promise<HourlyResponseData<DayScoreByFish>> {
    const weatherDataResult = await getAllWeatherData({
      datetime,
      latitude,
      longitude,
    });

    const app = await getSoloLunarPeriods({
      latitude: Number(latitude),
      longitude: Number(longitude),
      date: datetime,
      timezone: Number(timezone),
    });

    /* const moonPhasesData = getAstronomicalData({
      datetime,
      latitude,
      longitude,
    });
 */

    /*     console.log(sololunarData); */

    const hourlyData = weatherDataResult.hourly.map((data) => {
      return MakeDayScoreData({ ...data, fishList });
    });

    const targetHour = MakeDayScoreData({
      ...weatherDataResult.targetHour,
      fishList,
    });

    const result: HourlyResponseData<DayScoreByFish> = {
      hourly: hourlyData,
      targetHour: targetHour,
    };

    return result;
  };
}
