import { createCalculatorSession } from "@env-data/scriptsV2";
import { SpeciesCalculator } from "@env-data/scriptsV2/engine/calculator";
import { ScoreComputationResult } from "@env-data/scriptsV2/schema/types";
import { fishList } from "@env-data/types";
import { sololunarGeneration } from "../../../common/sololunar-generation";
import { DateTime } from "luxon";
import tzLookup from "tz-lookup";
import { HourlyResponseData } from "../../weather-data-slim/contracts/in/contracts.in.response";
import { getAllWeatherData } from "../../weather-data-slim/services";
import { ScoreQueryParams } from "../contracts/in/get-day-score.in.params";
import { HourlyScore } from "../domain/day-score-metrics.entity";
import { buildSunWindows } from "@env-data/scriptsV2/core/modifiers";

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
  }: ScoreQueryParams): Promise<
    Record<fishList, HourlyResponseData<DayScoreByFish>>
  > {
    const weatherDataResult = await getAllWeatherData({
      datetime,
      latitude,
      longitude,
    });

    const date = new Date(datetime);
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = date.getUTCDate().toString().padStart(2, "0");

    const sololunarData = sololunarGeneration({
      lat: Number(latitude),
      lon: Number(longitude),
      date: `${year}-${month}-${day}`,
    });
    const timezone =
      weatherDataResult.timezone ??
      tzLookup(Number(latitude), Number(longitude));

    const diurnalWindows = buildSunWindows(sololunarData);

    let resultByFish = {} as any;

    const solunarPeriodsData = {
      major1StartDec: sololunarData.major1StartDec,
      major1StopDec: sololunarData.major1StopDec,
      major2StartDec: sololunarData.major2StartDec,
      major2StopDec: sololunarData.major2StopDec,
      minor1StartDec: sololunarData.minor1StartDec,
      minor1StopDec: sololunarData.minor1StopDec,
      minor2StartDec: sololunarData.minor2StartDec,
      minor2StopDec: sololunarData.minor2StopDec,
      moonIllumination: sololunarData.moonIllumination,
    };

    const calculators = fishList.reduce((acc, specie) => {
      acc[specie] = createCalculatorSession(specie, diurnalWindows);
      return acc;
    }, {} as Record<fishList, SpeciesCalculator>);

    const calc = weatherDataResult.hourly.map((w) => {
      const dtLocal = DateTime.fromISO(w.time, { setZone: true }).setZone(
        timezone
      );
      const localHour = dtLocal.hour;
      const localHourDec = localHour + dtLocal.minute / 60;
      const timeLocalIso = dtLocal.toISO({ suppressMilliseconds: true });

      const scoreByFish = fishList.reduce((acc, specie) => {
        const calculator = calculators[specie];
        acc[specie] = calculator.calculate({
          temperature: w.temperature,
          humidity: w.humidity,
          pressure: w.pressure,
          windSpeed: w.windSpeed,
          probability: w.probability,
          total: w.total,
          showers: w.showers,
          localHour,
          localHourDec,
          pressureTrend6h: w.pressureTrend6h,
          solunarPeriodsData,
          moonIllumination: sololunarData.moonIllumination,
        });
        return acc;
      }, {} as Record<fishList, ScoreComputationResult>);

      return {
        ...w,
        time: timeLocalIso ?? w.time,
        ...scoreByFish,
        moonPhase: sololunarData.moonPhase,
      };
    });

    fishList.forEach((f) => {
      resultByFish[f] = { hourly: [] };

      calc.forEach((hourly) => {
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
          moonPhase,
        } = hourly;

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
          moonPhase,
        });
      });
    });

    return resultByFish;
  };
}
