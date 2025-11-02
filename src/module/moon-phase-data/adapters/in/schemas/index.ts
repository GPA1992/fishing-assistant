import { Type, Static } from "@sinclair/typebox";
import { DataResponseSchema } from "../../../../../shared/schemas";

export const astronomicalDataQuerySchema = Type.Object(
  {
    latitude: Type.Number(),
    longitude: Type.Number(),
    datetime: Type.String({ format: "date-time" }),
  },
  { additionalProperties: false }
);

export const visualCrossingAstronomyDataSchema = Type.Readonly(
  Type.Object(
    {
      date: Type.String(),
      sunrise: Type.String(),
      sunset: Type.String(),
      moonPhase: Type.Number(),
      moonPhaseDescription: Type.String(),
      moonRise: Type.Optional(Type.String()),
      moonSet: Type.Optional(Type.String()),
    },
    { additionalProperties: false }
  )
);

export const moonPhaseDataResponseSchema = Type.Object(
  {
    daily: Type.Array(visualCrossingAstronomyDataSchema),
    targetDay: visualCrossingAstronomyDataSchema,
  },
  { additionalProperties: false }
);

export const MoonPhaseResponseSchema = DataResponseSchema(
  moonPhaseDataResponseSchema
);
export type astronomicalDataQueryDto = Static<
  typeof astronomicalDataQuerySchema
>;
