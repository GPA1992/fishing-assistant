import { Sololunar } from "../adapters";
import { getSolunarPeriodsUseCase } from "./use-cases";

const sololunarPort = Sololunar.solunarApiProvider();

export const getSoloLunarPeriods = getSolunarPeriodsUseCase(sololunarPort);

export type { SolunarQueryParams } from "./contracts/sololunar-periods-params";
