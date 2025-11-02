import axios from "axios";
import { SolunarApiPort } from "../../../application/ports/sololunar-periods.port";
import { getSolunarDataFunc } from "./get-sololunar-data";

export function solunarApiProvider(): SolunarApiPort {
  const http = axios;
  return { getSolunarData: getSolunarDataFunc({ http }) };
}
