import {
  ScoreComputationInput,
  ScoreComputationResult,
  SpeciesId,
  SpeciesScoreConfig,
} from "./schema/types";
import { buildSpeciesCalculator, SpeciesCalculator } from "./engine/calculator";
import { trairaScoreConfig } from "./species/traira";
import { tucanareScoreConfig } from "./species/tucunare";

const registry = new Map<SpeciesId, SpeciesCalculator>();

const registerInternal = (config: SpeciesScoreConfig) => {
  const calculator = buildSpeciesCalculator(config);
  registry.set(config.id, calculator);
  return calculator;
};

export const registerSpecies = (config: SpeciesScoreConfig) =>
  registerInternal(config);

export const calculateScore = (
  speciesId: SpeciesId,
  input: ScoreComputationInput
): ScoreComputationResult => {
  const calculator = registry.get(speciesId);
  if (!calculator) {
    throw new Error(`Species "${speciesId}" is not registered in scriptsV2`);
  }
  return calculator.calculate(input);
};

export const getCalculator = (speciesId: SpeciesId) => registry.get(speciesId);

const bootstrapSpecies = () => {
  registerInternal(trairaScoreConfig);
  registerInternal(tucanareScoreConfig);
};

bootstrapSpecies();

export { trairaScoreConfig, tucanareScoreConfig };
