/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RangeBlockConfig } from "../core/range";
import type { RainRule, SpeciesScoreConfig } from "../schema/types";

const temperatureRanges: RangeBlockConfig[] = [
  { min: -20, max: 8, scoreStart: 0, scoreEnd: 0, curve: "linear" },
  { min: 8, max: 12, scoreStart: 20, scoreEnd: 25 },
  { min: 12, max: 15, scoreStart: 25, scoreEnd: 40 },
  { min: 15, max: 18, scoreStart: 40, scoreEnd: 60 },
  { min: 18, max: 22, scoreStart: 60, scoreEnd: 70 },
  { min: 22, max: 26, scoreStart: 70, scoreEnd: 100 },
  { min: 26, max: 30, scoreStart: 100, scoreEnd: 80 },
  { min: 30, max: 33, scoreStart: 80, scoreEnd: 20 },
  { min: 33, max: 36, scoreStart: 20, scoreEnd: 0 },
  { min: 36, max: 60, scoreStart: 0, scoreEnd: 0, curve: "linear" },
];

const humidityRanges: RangeBlockConfig[] = [
  { min: 0, max: 25, scoreStart: 60, scoreEnd: 60 },
  { min: 25, max: 35, scoreStart: 75, scoreEnd: 90 },
  { min: 35, max: 40, scoreStart: 90, scoreEnd: 100 },
  { min: 40, max: 50, scoreStart: 100, scoreEnd: 95 },
  { min: 50, max: 60, scoreStart: 95, scoreEnd: 75 },
  { min: 60, max: 70, scoreStart: 75, scoreEnd: 55 },
  { min: 70, max: 80, scoreStart: 55, scoreEnd: 35 },
  { min: 80, max: 90, scoreStart: 35, scoreEnd: 20 },
  { min: 90, max: 101, scoreStart: 20, scoreEnd: 20 },
];

const pressureRanges: RangeBlockConfig[] = [
  { min: 900, max: 980, scoreStart: 45, scoreEnd: 45 },
  { min: 980, max: 995, scoreStart: 50, scoreEnd: 60 },
  { min: 995, max: 1005, scoreStart: 60, scoreEnd: 75 },
  { min: 1005, max: 1010, scoreStart: 75, scoreEnd: 90 },
  { min: 1010, max: 1016, scoreStart: 90, scoreEnd: 100 },
  { min: 1016, max: 1022, scoreStart: 100, scoreEnd: 85 },
  { min: 1022, max: 1030, scoreStart: 85, scoreEnd: 60 },
  { min: 1030, max: 1050, scoreStart: 60, scoreEnd: 60 },
];

const windRanges: RangeBlockConfig[] = [
  { min: 0, max: 3, scoreStart: 95, scoreEnd: 100 },
  { min: 3, max: 8, scoreStart: 100, scoreEnd: 80 },
  { min: 8, max: 18, scoreStart: 80, scoreEnd: 60 },
  { min: 18, max: 28, scoreStart: 60, scoreEnd: 35 },
  { min: 28, max: 40, scoreStart: 35, scoreEnd: 20 },
  { min: 40, max: 80, scoreStart: 15, scoreEnd: 15 },
];

const rainRules: { base: RainRule[]; modifiers: RainRule[] } = {
  base: [
    {
      name: "totally-dry",
      when: { volume: { equals: 0 }, probability: { equals: 0 } },
      action: "set",
      value: { type: "constant", value: 40 },
    },
    {
      name: "dry-low-prob",
      when: { volume: { equals: 0 }, probability: { min: 0, lt: 30 } },
      action: "set",
      value: {
        type: "range",
        field: "probability",
        ranges: [{ min: 0, max: 30, scoreStart: 45, scoreEnd: 60 }],
        fallback: 50,
      },
    },
    {
      name: "dry-medium-prob",
      when: { volume: { equals: 0 }, probability: { min: 30, lt: 70 } },
      action: "set",
      value: {
        type: "range",
        field: "probability",
        ranges: [{ min: 30, max: 70, scoreStart: 60, scoreEnd: 75 }],
        fallback: 65,
      },
    },
    {
      name: "dry-high-prob",
      when: { volume: { equals: 0 }, probability: { gte: 70 } },
      action: "set",
      value: {
        type: "range",
        field: "probability",
        ranges: [{ min: 70, max: 100, scoreStart: 75, scoreEnd: 85 }],
        fallback: 80,
      },
    },
    {
      name: "light-rain",
      when: { volume: { gt: 0, lte: 2 } },
      action: "set",
      value: {
        type: "range",
        field: "volume",
        ranges: [{ min: 0, max: 2, scoreStart: 65, scoreEnd: 78 }],
        fallback: 70,
      },
    },
    {
      name: "moderate-rain",
      when: { volume: { gt: 2, lte: 5 } },
      action: "set",
      value: {
        type: "range",
        field: "volume",
        ranges: [{ min: 2, max: 5, scoreStart: 40, scoreEnd: 25 }],
        fallback: 35,
      },
    },
    {
      name: "heavy-rain",
      when: { volume: { gt: 5, lte: 20 } },
      action: "set",
      value: {
        type: "range",
        field: "volume",
        ranges: [{ min: 5, max: 20, scoreStart: 25, scoreEnd: 5 }],
        fallback: 10,
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
        humidity: { lte: 75 },
        warm: true,
      },
      action: "max",
      value: {
        type: "range",
        field: "volume",
        ranges: [{ min: 0.5, max: 3, scoreStart: 80, scoreEnd: 95 }],
        fallback: 80,
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
        ranges: [{ min: 30, max: 90, scoreStart: 70, scoreEnd: 92 }],
        fallback: 70,
      },
    },
    {
      name: "cold-rain-penalty",
      when: { cold: true, volume: { gt: 0 } },
      action: "scale",
      value: { type: "constant", value: 0.5 },
    },
    {
      name: "humidity-penalty",
      when: { humidity: { gt: 95 }, volume: { gt: 0 }, showers: { equals: 0 } },
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

export const trairaScoreConfig: SpeciesScoreConfig = {
  id: "traira",
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
      fall: { limit: 6, maxBonus: 6 },
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
      warm: { min: 24, max: 32 },
      hot: { min: 32 },
      cold: { max: 20 },
    },
    clamp: { min: 0, max: 100 },
  },
  diurnal: {
    maxBonus: 10,
    clamp: { min: 0, max: 10 },
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
