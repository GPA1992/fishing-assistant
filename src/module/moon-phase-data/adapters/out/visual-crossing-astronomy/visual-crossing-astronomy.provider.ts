import axios from "axios";
import { VisualCrossingAstronomyPort } from "../../../application/ports/visual-crossing-astronomy.port";
import { getAstronomicalDataFunc } from "./get-astromical-data";
import { RepoDeps } from "../../../../../shared/types";

export function visualCrossingAstronomyProvider(
  deps: RepoDeps = {}
): VisualCrossingAstronomyPort {
  const apiKey = deps.apiKey ?? "DVJWSKZEQZ5A2XK7TAVV7QJSY";

  const http = deps.http ?? axios;

  return {
    getAstronomicalData: getAstronomicalDataFunc({ apiKey, http }),
  };
}
