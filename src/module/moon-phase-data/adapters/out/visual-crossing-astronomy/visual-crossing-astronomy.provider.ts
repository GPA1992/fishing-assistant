import axios from "axios";
import { VisualCrossingAstronomyPort } from "../../../application/ports/visual-crossing-astronomy.port";
import { getAstronomicalDataFunc } from "./get-astromical-data";

export function visualCrossingAstronomyProvider(): VisualCrossingAstronomyPort {
  const apiKey = "DVJWSKZEQZ5A2XK7TAVV7QJSY";
  const http = axios;

  return {
    getAstronomicalData: getAstronomicalDataFunc({ apiKey, http }),
  };
}
