import {
  ScoreComputationInput,
  ScoreComputationResult,
  SpeciesId,
  SpeciesScoreConfig,
} from "./schema/types";
import { buildSpeciesCalculator, SpeciesCalculator } from "./engine/calculator";
import { trairaScoreConfig } from "./species/traira";
import { tucanareScoreConfig } from "./species/tucunare";

const registry = new Map<SpeciesId, SpeciesScoreConfig>();

const registerInternal = (config: SpeciesScoreConfig) => {
  registry.set(config.id, config);
  return buildSpeciesCalculator(config);
};

export const registerSpecies = (config: SpeciesScoreConfig) =>
  registerInternal(config);

export const createCalculatorSession = (
  speciesId: SpeciesId
): SpeciesCalculator => {
  const config = registry.get(speciesId);
  if (!config) {
    throw new Error(`Species "${speciesId}" is not registered in scriptsV2`);
  }
  return buildSpeciesCalculator(config);
};

export const calculateScore = (
  speciesId: SpeciesId,
  input: ScoreComputationInput
): ScoreComputationResult => {
  const calculator = createCalculatorSession(speciesId);
  return calculator.calculate(input);
};

export const getCalculator = (speciesId: SpeciesId) =>
  registry.has(speciesId) ? createCalculatorSession(speciesId) : undefined;

const bootstrapSpecies = () => {
  registerInternal(trairaScoreConfig);
  registerInternal(tucanareScoreConfig);
};

bootstrapSpecies();

export { trairaScoreConfig, tucanareScoreConfig };
