import axios from "axios";
import { MoonPhaseParams, MoonPhaseDataResponse } from "../../../application";
import { makeVisualCrossingAstronomyData } from "../../../domain/visual-crossing-astronomy-data";
import { VisualCrossingAstronomyResponse } from "./contracts/visual-crossing-response";

type Deps = {
  apiKey: string;
  http: typeof axios;
};

export function getAstronomicalDataFunc({ apiKey, http }: Deps) {
  return async function getAstronomicalData({
    datetime,
    latitude,
    longitude,
  }: MoonPhaseParams): Promise<MoonPhaseDataResponse> {
    const startDate = new Date(datetime);
    startDate.setDate(startDate.getDate() - 5);

    const endDate = new Date(datetime);
    endDate.setDate(endDate.getDate() + 5);

    const location = `${latitude},${longitude}`;
    const start = startDate.toISOString().split("T")[0];
    const end = endDate.toISOString().split("T")[0];

    const url =
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/` +
      `${location}/${start}/${end}` +
      `?unitGroup=metric&key=${apiKey}&include=days&elements=` +
      `datetime,moonphase,sunrise,sunset,moonrise,moonset`;

    const res = await http.get<VisualCrossingAstronomyResponse>(url);
    const { days } = res.data;

    const daily = days.map((day) =>
      makeVisualCrossingAstronomyData({
        date: day.datetime,
        sunrise: day.sunrise,
        sunset: day.sunset,
        moonPhase: day.moonphase,
        moonRise: day.moonrise,
        moonSet: day.moonset,
      })
    );

    const targetDateStr = datetime.toISOString().split("T")[0];
    const targetDay = daily.find((d) => d.date === targetDateStr);

    if (!targetDay)
      throw new Error(`Dados não encontrados para a data ${targetDateStr}`);

    return { daily, targetDay };
  };
}
