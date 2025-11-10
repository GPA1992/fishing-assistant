import { Static, Type } from "@sinclair/typebox";
import { DataResponseSchema } from "../../../../shared/schemas";

export const WeatherDataQuerySchema = Type.Object(
  {
    latitude: Type.Number(),
    longitude: Type.Number(),
    targetDay: Type.String(),
    targetMonth: Type.String(),
    targetHour: Type.String(),
  },
  { additionalProperties: false }
);
export type WeatherDataQuery = Static<typeof WeatherDataQuerySchema>;

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

export const GetRainDataQuerySchema = Type.Object(
  {
    latitude: Type.Number(),
    longitude: Type.Number(),
    datetime: Type.String({ format: "date-time" }),
  },
  { additionalProperties: false }
);

export type GetRainDataQuery = Static<typeof GetRainDataQuerySchema>;

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
