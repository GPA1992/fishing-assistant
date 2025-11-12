import { calculateTotalScoreBySpecie } from "./algorithms/total-calc";
import {
  trairaEnvironmentSpecification,
  climaticConditionsCalc as trairaClimaticConditionsCalc,
  moonPhaseCalc as trairaMoonPhaseCalc,
  rainCalc as trairaRainCalc,
  sololunarCalc as trairaSololunarCalc,
} from "./traira";
import {
  calcScoreFunctions,
  calculateTotalScoreBySpecieType,
  environmentDataType,
  fishList,
} from "./types";

export const environmentDataByFish: Record<fishList, environmentDataType> = {
  traira: {
    ...trairaEnvironmentSpecification,
  },
};

export const calTotalScore: calculateTotalScoreBySpecieType = {
  calculateTotalScoreBySpecie: calculateTotalScoreBySpecie,
};

export const calcFuncBySpecie: Record<fishList, calcScoreFunctions> = {
  traira: {
    climaticConditionsCalc: trairaClimaticConditionsCalc,
    moonPhaseCalc: trairaMoonPhaseCalc,
    rainCalc: trairaRainCalc,
    sololunarCalc: trairaSololunarCalc,
  },
};
