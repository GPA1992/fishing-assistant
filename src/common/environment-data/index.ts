import { calculateTotalScoreBySpecie } from "./algorithms";
import { trairaEnvironmentSpecification, trairaScoreFunctions } from "./traira";
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
  traira: trairaScoreFunctions,
};
