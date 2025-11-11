import { Static, Type } from "@sinclair/typebox";
import { DataResponseSchema } from "../../../../shared/schemas";

export const ScoreDataQuerySchema = Type.Object(
  {
    latitude: Type.Number(),
    longitude: Type.Number(),
    targetDay: Type.String(),
    targetMonth: Type.String(),
    targetHour: Type.String(),
    fishList: Type.String(),
    timezone: Type.Number(),
  },
  { additionalProperties: false }
);
export type ScoreDataQuery = Static<typeof ScoreDataQuerySchema>;

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
