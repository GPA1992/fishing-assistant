import { Sololunar } from "../../domain/sololunar-periods-data";
import { SolunarQueryParams } from "../contracts/sololunar-periods-params";

export type SolunarApiPort = {
  getSolunarData: (params: SolunarQueryParams) => Promise<Sololunar>;
};
