import axios from "axios";
import { SolunarQueryParams } from "../../../application";
import {
  makeSolunarPeriod,
  SolunarPeriod,
} from "../../../domain/sololunar-periods-data";

type Deps = {
  http: typeof axios;
};

export function getSolunarDataFunc({ http }: Deps) {
  return async function getSolunarData({
    latitude,
    longitude,
    date,
    timezone,
  }: SolunarQueryParams): Promise<SolunarPeriod> {
    const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, "");
    const url = `https://api.solunar.org/solunar/${latitude},${longitude},${formattedDate},${timezone}`;
    const result = await http.get(url);
    const { data } = result;

    console.log(data);

    return makeSolunarPeriod({
      date: new Date(date),
      sunRise: data.sunRise,
      sunTransit: data.sunTransit,
      sunSet: data.sunSet,
      moonRise: data.moonRise,
      moonTransit: data.moonTransit,
      moonUnderfoot: data.moonUnder,
      moonSet: data.moonSet,
      moonPhase: data.moonPhase,
      moonIllumination: data.moonIllumination,
      majorPeriods: [
        { start: data.major1Start, end: data.major1Stop },
        { start: data.major2Start, end: data.major2Stop },
      ],
      minorPeriods: [
        { start: data.minor1Start, end: data.minor1Stop },
        { start: data.minor2Start, end: data.minor2Stop },
      ],
      dayRating: data.dayRating,
      hourlyRating: data.hourlyRating,
    });
  };
}
