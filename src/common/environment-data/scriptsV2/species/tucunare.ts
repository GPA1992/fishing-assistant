import { RangeBlockConfig } from "../core/range";
import { RainRule, SpeciesScoreConfig } from "../schema/types";

const temperatureRanges: RangeBlockConfig[] = [
  { min: -20, max: 18, scoreStart: 0, scoreEnd: 0, curve: "linear" },
  { min: 18, max: 20, scoreStart: 0, scoreEnd: 10 },
  { min: 20, max: 22, scoreStart: 10, scoreEnd: 30 },
  { min: 22, max: 24, scoreStart: 30, scoreEnd: 55 },
  { min: 24, max: 26, scoreStart: 55, scoreEnd: 80 },
  { min: 26, max: 28, scoreStart: 80, scoreEnd: 100 },
  { min: 28, max: 30, scoreStart: 100, scoreEnd: 95 },
  { min: 30, max: 32, scoreStart: 95, scoreEnd: 60 },
  { min: 32, max: 34, scoreStart: 60, scoreEnd: 20 },
  { min: 34, max: 38, scoreStart: 20, scoreEnd: 5 },
  { min: 38, max: 60, scoreStart: 5, scoreEnd: 0, curve: "linear" },
];

const humidityRanges: RangeBlockConfig[] = [
  { min: 0, max: 35, scoreStart: 30, scoreEnd: 35 },
  { min: 35, max: 50, scoreStart: 35, scoreEnd: 55 },
  { min: 50, max: 70, scoreStart: 55, scoreEnd: 70 },
  { min: 70, max: 85, scoreStart: 70, scoreEnd: 90 },
  { min: 85, max: 95, scoreStart: 90, scoreEnd: 100 },
  { min: 95, max: 101, scoreStart: 100, scoreEnd: 90 },
];

const pressureRanges: RangeBlockConfig[] = [
  { min: 900, max: 985, scoreStart: 50, scoreEnd: 55 },
  { min: 985, max: 1008, scoreStart: 55, scoreEnd: 90 },
  { min: 1008, max: 1014, scoreStart: 90, scoreEnd: 100 },
  { min: 1014, max: 1020, scoreStart: 100, scoreEnd: 95 },
  { min: 1020, max: 1024, scoreStart: 95, scoreEnd: 75 },
  { min: 1024, max: 1032, scoreStart: 75, scoreEnd: 45 },
  { min: 1032, max: 1050, scoreStart: 45, scoreEnd: 45 },
];

const windRanges: RangeBlockConfig[] = [
  { min: 0, max: 4, scoreStart: 95, scoreEnd: 100 },
  { min: 4, max: 8, scoreStart: 100, scoreEnd: 90 },
  { min: 8, max: 18, scoreStart: 90, scoreEnd: 70 },
  { min: 18, max: 28, scoreStart: 70, scoreEnd: 35 },
  { min: 28, max: 40, scoreStart: 35, scoreEnd: 15 },
  { min: 40, max: 80, scoreStart: 15, scoreEnd: 15 },
];

const rainRules: { base: RainRule[]; modifiers: RainRule[] } = {
  base: [
    {
      name: "totally-dry",
      when: { volume: { equals: 0 }, probability: { equals: 0 } },
      action: "set",
      value: { type: "constant", value: 30 },
    },
    {
      name: "dry-low-prob",
      when: { volume: { equals: 0 }, probability: { min: 0, lt: 30 } },
      action: "set",
      value: {
        type: "range",
        field: "probability",
        ranges: [{ min: 0, max: 30, scoreStart: 40, scoreEnd: 55 }],
        fallback: 45,
      },
    },
    {
      name: "dry-medium-prob",
      when: { volume: { equals: 0 }, probability: { min: 30, lt: 70 } },
      action: "set",
      value: {
        type: "range",
        field: "probability",
        ranges: [{ min: 30, max: 70, scoreStart: 65, scoreEnd: 80 }],
        fallback: 70,
      },
    },
    {
      name: "dry-high-prob",
      when: { volume: { equals: 0 }, probability: { gte: 70 } },
      action: "set",
      value: {
        type: "range",
        field: "probability",
        ranges: [{ min: 70, max: 100, scoreStart: 80, scoreEnd: 95 }],
        fallback: 88,
      },
    },
    {
      name: "light-rain",
      when: { volume: { gt: 0, lte: 2 } },
      action: "set",
      value: {
        type: "range",
        field: "volume",
        ranges: [{ min: 0, max: 2, scoreStart: 75, scoreEnd: 95 }],
        fallback: 85,
      },
    },
    {
      name: "moderate-rain",
      when: { volume: { gt: 2, lte: 5 } },
      action: "set",
      value: {
        type: "range",
        field: "volume",
        ranges: [{ min: 2, max: 5, scoreStart: 55, scoreEnd: 40 }],
        fallback: 50,
      },
    },
    {
      name: "heavy-rain",
      when: { volume: { gt: 5, lte: 20 } },
      action: "set",
      value: {
        type: "range",
        field: "volume",
        ranges: [{ min: 5, max: 20, scoreStart: 30, scoreEnd: 10 }],
        fallback: 20,
      },
    },
    {
      name: "extreme-heavy-rain",
      when: { volume: { gt: 20 } },
      action: "set",
      value: {
        type: "constant",
        value: 5,
      },
    },
  ],
  modifiers: [
    {
      name: "sunny-warm-shower",
      when: {
        volume: { equals: 0 },
        showers: { gt: 0 },
        probability: { lt: 40 },
        humidity: { lte: 85 },
        warm: true,
      },
      action: "max",
      value: {
        type: "range",
        field: "volume",
        ranges: [{ min: 0.5, max: 3, scoreStart: 85, scoreEnd: 98 }],
        fallback: 88,
      },
    },
    {
      name: "pre-rain-warm",
      when: {
        volume: { equals: 0 },
        probability: { gte: 30 },
        warm: true,
      },
      action: "max",
      value: {
        type: "range",
        field: "probability",
        ranges: [{ min: 30, max: 90, scoreStart: 75, scoreEnd: 95 }],
        fallback: 80,
      },
    },
    {
      name: "humidity-instability-boost",
      when: { humidity: { gt: 85 }, probability: { gte: 40 } },
      action: "max",
      value: {
        type: "range",
        field: "probability",
        ranges: [{ min: 40, max: 100, scoreStart: 78, scoreEnd: 92 }],
        fallback: 80,
      },
    },
    {
      name: "cold-rain-penalty",
      when: { cold: true, volume: { gt: 0 } },
      action: "scale",
      value: { type: "constant", value: 0.7 },
    },
    {
      name: "storm-heavy-volume",
      when: { volume: { gte: 8 } },
      action: "min",
      value: {
        type: "range",
        field: "volume",
        ranges: [{ min: 8, max: 30, scoreStart: 15, scoreEnd: 0 }],
        fallback: 10,
      },
    },
    {
      name: "storm-windy-probable",
      when: { probability: { gte: 70 }, wind: { gte: 25 } },
      action: "min",
      value: {
        type: "range",
        field: "volume",
        ranges: [{ min: 8, max: 30, scoreStart: 15, scoreEnd: 0 }],
        fallback: 15,
      },
    },
    {
      name: "hot-dry",
      when: {
        hot: true,
        volume: { equals: 0 },
        probability: { equals: 0 },
      },
      action: "scale",
      value: {
        type: "range",
        field: "temperature",
        ranges: [{ min: 32, max: 38, scoreStart: 1, scoreEnd: 0.6 }],
        fallback: 0.6,
      },
    },
  ],
};

export const tucanareScoreConfig: SpeciesScoreConfig = {
  id: "tucunare",
  weights: {
    temperature: 0.32,
    pressure: 0.24,
    wind: 0.19,
    rain: 0.2,
    humidity: 0.05,
  },
  temperature: {
    ranges: temperatureRanges,
    clamp: { min: 0, max: 100 },
    fallback: 0,
  },
  humidity: {
    ranges: humidityRanges,
    clamp: { min: 0, max: 100 },
  },
  pressure: {
    ranges: pressureRanges,
    clamp: { min: 0, max: 100 },
    trend: {
      fall: { limit: 6, maxBonus: 8 },
      rise: { limit: 6, maxPenalty: 12 },
    },
  },
  wind: {
    ranges: windRanges,
    clamp: { min: 0, max: 100 },
  },
  rain: {
    baseRules: rainRules.base,
    modifiers: rainRules.modifiers,
    temperatureBands: {
      warm: { min: 26, max: 32 },
      hot: { min: 32 },
      cold: { max: 22 },
    },
    clamp: { min: 0, max: 100 },
  },
  diurnal: {
    amplitudeBase: 0.05,
    temperatureRanges: [
      { min: -10, max: 20, scoreStart: 0.25, scoreEnd: 0.25 },
      { min: 20, max: 24, scoreStart: 0.25, scoreEnd: 0.6 },
      { min: 24, max: 26, scoreStart: 0.6, scoreEnd: 0.85 },
      { min: 26, max: 30, scoreStart: 0.85, scoreEnd: 1 },
      { min: 30, max: 32, scoreStart: 1, scoreEnd: 0.75 },
      { min: 32, max: 36, scoreStart: 0.75, scoreEnd: 0.4 },
      { min: 36, max: 50, scoreStart: 0.4, scoreEnd: 0.25 },
    ],
    fallbackSuitability: 0.7,
  },
  moonBonus: {
    maxBonus: 2,
    mode: "center-peaks",
  },
  solunarBonus: {
    majorWeight: 4,
    minorWeight: 2,
    maxBonus: 8,
  },
  bonusCap: 8,
  precision: 3,
};
