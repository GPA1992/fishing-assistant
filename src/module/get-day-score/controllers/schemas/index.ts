import { Static, Type } from "@sinclair/typebox";
import { DataResponseSchema } from "../../../../shared/schemas";

export const ScoreDataBodySchema = Type.Object(
  {
    latitude: Type.Number(),
    longitude: Type.Number(),
    targetDay: Type.String(),
    targetMonth: Type.String(),
    fishList: Type.Array(Type.String()),
  },
  { additionalProperties: false }
);
export type ScoreDataBody = Static<typeof ScoreDataBodySchema>;

const SpeciesIdSchema = Type.Union([
  Type.Literal("traira"),
  Type.Literal("tucunare"),
]);

export const ScoreTestBodySchema = Type.Object(
  {
    speciesId: Type.Optional(SpeciesIdSchema),
    time: Type.String({ format: "date-time" }),
    temperature: Type.Number(),
    humidity: Type.Number(),
    pressure: Type.Number(),
    windSpeed: Type.Number(),
    probability: Type.Number(),
    total: Type.Optional(Type.Number()),
    rain: Type.Optional(Type.Number()),
    showers: Type.Number(),
    pressureTrend6h: Type.Optional(Type.Number()),
    moonIllumination: Type.Optional(
      Type.Number({ minimum: 0, maximum: 1 })
    ),
  },
  { additionalProperties: false }
);
export type ScoreTestBody = Static<typeof ScoreTestBodySchema>;

export const WeatherDataSchema = Type.Object(
  {
    time: Type.String(),
    temperature: Type.Number(),
    humidity: Type.Number(),
    pressure: Type.Number(),
    windSpeed: Type.Number(),
  },
  { additionalProperties: false }
);

export const WeatherDataResponseSchema = DataResponseSchema(
  Type.Array(WeatherDataSchema)
);
export type WeatherDataResponse = Static<typeof WeatherDataResponseSchema>;

export const RainDataEntitySchema = Type.Object(
  {
    time: Type.String(),
    probability: Type.Number(),
    total: Type.Number(),
    rain: Type.Number(),
    showers: Type.Number(),
  },
  { additionalProperties: false }
);

export const RainDataResponseSchema = DataResponseSchema(RainDataEntitySchema);
