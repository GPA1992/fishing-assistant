import { calTotalScore } from "../../../common/environment-data";
import { movingAverageCentered } from "../../../common/environment-data/algorithms";
import { fishList } from "../../../common/environment-data/types";
import { sololunarGeneration } from "../../../common/sololunar-generation";
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

    const date = new Date(datetime);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    const sololunarData = sololunarGeneration({
      lat: Number(latitude),
      lon: Number(longitude),
      date: `${year}-${month}-${day}`,
    });

    console.log(sololunarData);

    let resultByFish = {} as any;

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

      const dt = new Date(w.time);

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
          localHour: dt.getUTCHours(),
          localHourDec: dt.getUTCHours() + dt.getUTCMinutes() / 60,
          pressureTrend6h: w.pressureTrend6h,
          sixHourTemp,
          solunarPeriodsData: { ...sololunarData },
        },
        fishList
      );
      return {
        ...w,
        ...calc,
        moonPhase: sololunarData.moonPhase,
      };
    });

    fishList.map((f) => {
      calc.map((hourly) => {
        const {
          time,
          temperature,
          humidity,
          pressure,
          windSpeed,
          probability,
          rain,
          showers,
          total,
          pressureTrend6h,
        } = hourly;
        if (!resultByFish[f]) {
          resultByFish[f] = {
            hourly: [
              {
                time,
                temperature,
                humidity,
                pressure,
                windSpeed,
                probability,
                rain,
                showers,
                total,
                pressureTrend6h,
                score: hourly[f],
              },
            ],
          };
        }
        if (resultByFish[f]) {
          resultByFish[f].hourly.push({
            time,
            temperature,
            humidity,
            pressure,
            windSpeed,
            probability,
            rain,
            showers,
            total,
            pressureTrend6h,
            score: hourly[f],
          });
        }
      });
      const target = calc.find(
        (c) => weatherDataResult.targetHour.time === c.time
      );

      const {
        time,
        temperature,
        humidity,
        pressure,
        windSpeed,
        probability,
        rain,
        showers,
        total,
        pressureTrend6h,
      } = target!;

      resultByFish[f] = {
        ...resultByFish[f],
        targetHour: [
          {
            time,
            temperature,
            humidity,
            pressure,
            windSpeed,
            probability,
            rain,
            showers,
            total,
            pressureTrend6h,
            score: target![f],
          },
        ],
      };
    });

    return resultByFish;
  };
}
