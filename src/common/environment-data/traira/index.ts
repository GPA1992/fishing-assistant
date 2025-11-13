import { trairaEnvironmentSpecification } from "./descriptions";
import * as trairaScorers from "./scorers";

export { trairaEnvironmentSpecification };
export {
  climaticConditionsCalc,
  moonPhaseCalc,
  sololunarCalc,
  rainCalc,
} from "./scorers";

export const trairaScoreFunctions = trairaScorers;
