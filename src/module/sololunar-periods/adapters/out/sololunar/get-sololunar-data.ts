import axios from "axios";
import { SolunarQueryParams } from "../../../application";
import {
  makeSolunarPeriod,
  Sololunar,
} from "../../../domain/sololunar-periods-data";

type Deps = {
  http: typeof axios;
};

export function getSolunarDataFunc({ http }: Deps) {
  return async function getSolunarData({
    latitude,
    longitude,
    date,
  }: SolunarQueryParams): Promise<Sololunar> {
    const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, "");
    const url = `https://api.solunar.org/solunar/${latitude},${longitude},${formattedDate},-3`;

    const result = await http.get(url);
    const { data } = result;

    return makeSolunarPeriod({
      ...data,
    });
  };
}
