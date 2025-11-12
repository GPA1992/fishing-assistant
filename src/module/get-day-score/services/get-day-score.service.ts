import { calTotalScore } from "../../../common/environment-data";
import { movingAverageCentered } from "../../../common/environment-data/algorithms";
import { fishList } from "../../../common/environment-data/types";
import { getSoloLunarPeriods } from "../../sololunar-periods/application";
import { HourlyResponseData } from "../../weather-data-slim/contracts/in/contracts.in.response";
import { getAllWeatherData } from "../../weather-data-slim/services";
import { ScoreQueryParams } from "../contracts/in/get-day-score.in.params";
import { HourlyScore } from "../domain/day-score-metrics.entity";

export type DayScoreByFish = Readonly<Record<fishList, HourlyScore>>;
type GetScoreData = (
  params: ScoreQueryParams
) => Promise<Record<fishList, HourlyResponseData<DayScoreByFish>>>;

export function getScoreDayService(): GetScoreData {
  return async function geScoreData({
    datetime,
    latitude,
    longitude,
    fishList,
  }: ScoreQueryParams): Promise</* Record<fishList, HourlyResponseData<DayScoreByFish>> */ any> {
    const weatherDataResult = await getAllWeatherData({
      datetime,
      latitude,
      longitude,
    });

    const sololunarData = await getSoloLunarPeriods({
      latitude: Number(latitude),
      longitude: Number(longitude),
      date: datetime,
    });

    /* const moonPhasesData = getAstronomicalData({
      datetime,
      latitude,
      longitude,
    });
 */

    let resultByFish = {} as any;

    /* fishList.forEach((f) => {
      if (!resultByFish[f]) resultByFish[f] = { hourly: [] };
      hourlyData.map((h) => {
        if (!resultByFish[f]) {
          resultByFish[f]["hourly"] = [{ ...h[f] }];
        }
        if (resultByFish[f]) {
          resultByFish[f].hourly.push({
            ...h[f],
          });
        }
      });
      if (!resultByFish[f].targetHour) {
        const hour = new Date(weatherDataResult.targetHour.time)
          .getHours()
          .toString() as keyof (typeof sololunarData)["hourlyRating"];

        const target = MakeDayScoreData({
          ...weatherDataResult.targetHour,
          fishList,
          sololunarScore: sololunarData.hourlyRating[hour],
        })[f];

        resultByFish[f].targetHour = {
          ...target,
        };
      }
    }); */

    const { calculateTotalScoreBySpecie } = calTotalScore;

    const calc = weatherDataResult.hourly.map((w, i) => {
      const hour = new Date(w.time)
        .getUTCHours()
        .toString() as keyof (typeof sololunarData)["hourlyRating"];
      const sololunarScoreFromApi = sololunarData.hourlyRating[hour];
      const sololunarBonus =
        (sololunarData.dayRating + sololunarScoreFromApi / 10) / 2;

      const sixHourTemp = movingAverageCentered(
        weatherDataResult.hourly,
        i,
        3,
        (row) => row.temperature
      );

      const calc = calculateTotalScoreBySpecie(
        {
          humidity: w.humidity,
          pressure: w.pressure,
          probability: w.probability,
          rain: w.rain,
          time: w.time,
          total: w.total,
          windSpeed: w.windSpeed,
          showers: w.showers,
          sololunarScore: sololunarBonus,
          temperature: w.temperature,
          localHour: new Date(w.time).getUTCHours(),
          pressureTrend6h: w.pressureTrend6h,
          sixHourTemp,
        },
        fishList
      );
      return {
        ...w,
        ...calc,
      };
    });

    return calc;
  };
}
