import type { SpeciesId, SpeciesScoreConfig } from "./schema/types";
import type { SpeciesCalculator } from "./engine/calculator";
import { buildSpeciesCalculator } from "./engine/calculator";
import { trairaScoreConfig } from "./species/traira";
import { tucanareScoreConfig } from "./species/tucunare";
import type { DiurnalBonusWindow } from "./core/modifiers";

const registry = new Map<SpeciesId, SpeciesScoreConfig>();

const registerInternal = (config: SpeciesScoreConfig) => {
  registry.set(config.id, config);
  return buildSpeciesCalculator(config);
};

export const createCalculatorSession = (
  speciesId: SpeciesId,
  diurnalWindows?: DiurnalBonusWindow[]
): SpeciesCalculator => {
  const config = registry.get(speciesId);
  if (!config) {
    throw new Error(`Species "${speciesId}" is not registered in scriptsV2`);
  }
  const diurnalOverride = diurnalWindows
    ? { ...config.diurnal, windows: diurnalWindows }
    : config.diurnal;
  return buildSpeciesCalculator({ ...config, diurnal: diurnalOverride });
};

const bootstrapSpecies = () => {
  registerInternal(trairaScoreConfig);
  registerInternal(tucanareScoreConfig);
};

bootstrapSpecies();

export { trairaScoreConfig, tucanareScoreConfig };
