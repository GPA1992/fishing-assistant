import { SolunarPeriod } from "../../domain/sololunar-periods-data";
import { SolunarQueryParams } from "../contracts/sololunar-periods-params";
import { SolunarApiPort } from "../ports/sololunar-periods.port";

export type GetSolunarPeriods = (
  params: SolunarQueryParams
) => Promise<SolunarPeriod>;

export function getSolunarPeriodsUseCase(
  solunarPort: SolunarApiPort
): GetSolunarPeriods {
  return async function getSolunarPeriods(
    params: SolunarQueryParams
  ): Promise<SolunarPeriod> {
    return solunarPort.getSolunarData(params);
  };
}
