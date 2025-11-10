import {
  trairaEnvironmentSpecification,
  climaticConditionsCalc as trairaClimaticConditionsCalc,
  moonPhaseCalc as trairaMoonPhaseCalc,
  rainCalc as trairaRainCalc,
  sololunarCalc as trairaSololunarCalc,
} from "./traira";
import { environmentDataType, fishList } from "./types";

export const environmentDataByFish: Record<fishList, environmentDataType> = {
  traira: {
    ...trairaEnvironmentSpecification,
    calcScoreFunctions: {
      climaticConditionsCalc: trairaClimaticConditionsCalc,
      moonPhaseCalc: trairaMoonPhaseCalc,
      rainCalc: trairaRainCalc,
      sololunarCalc: trairaSololunarCalc,
    },
  },
};
