import { MoonPhaseDataResponse } from "../contracts/moon-pahase-day-response";
import { MoonPhaseParams } from "../contracts/moon-phases-input-params";
import { VisualCrossingAstronomyPort } from "../ports/visual-crossing-astronomy.port";

export type GetAstronomicalData = (
  params: MoonPhaseParams
) => Promise<MoonPhaseDataResponse>;

export function getAstronomicalDataUseCase(
  astronomyPort: VisualCrossingAstronomyPort
): GetAstronomicalData {
  return async function getAstronomicalData(params: MoonPhaseParams) {
    return astronomyPort.getAstronomicalData(params) ;
  };
}
