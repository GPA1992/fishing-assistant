import { VisualCrossingAstronomy } from "../adapters";
import { getAstronomicalDataUseCase } from "./use-cases";

const astronomyPort = VisualCrossingAstronomy.visualCrossingAstronomyProvider();


export const getAstronomicalData = getAstronomicalDataUseCase(astronomyPort);

export type { MoonPhaseDataResponse } from "./contracts/moon-pahase-day-response";
export type { MoonPhaseParams } from "./contracts/moon-phases-input-params";
