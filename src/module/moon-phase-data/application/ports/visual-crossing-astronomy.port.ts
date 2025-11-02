import { MoonPhaseDataResponse } from "../contracts/moon-pahase-day-response";
import { MoonPhaseParams } from "../contracts/moon-phases-input-params";



export type VisualCrossingAstronomyPort = {
  getAstronomicalData: (
    params: MoonPhaseParams
  ) => Promise<MoonPhaseDataResponse>;
};
