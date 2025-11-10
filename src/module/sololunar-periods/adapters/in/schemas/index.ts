// routes/sololunar/infra/http/schemas.ts
import { Type, Static } from "@sinclair/typebox";
import { DataResponseSchema } from "../../../../../shared/schemas";

export const solunarQuerySchema = Type.Object(
  {
    latitude: Type.Number(),
    longitude: Type.Number(),
    targetDay: Type.String(),
    targetMonth: Type.String(),
    targetHour: Type.String(),
    timezone: Type.Number(),
  },
  { additionalProperties: false }
);
export type SolunarQueryParams = Static<typeof solunarQuerySchema>;

const periodWindowSchema = Type.Object(
  {
    start: Type.String(),
    end: Type.String(),
  },
  { additionalProperties: false }
);

export const solunarPeriodSchema = Type.Readonly(
  Type.Object(
    {
      date: Type.String({ format: "date-time" }),
      sunRise: Type.String(),
      sunTransit: Type.String(),
      sunSet: Type.String(),
      moonRise: Type.String(),
      moonTransit: Type.String(),
      moonUnderfoot: Type.String(),
      moonSet: Type.String(),
      moonPhase: Type.String(),
      moonIllumination: Type.Number(),
      majorPeriods: Type.Array(periodWindowSchema),
      minorPeriods: Type.Array(periodWindowSchema),
      dayRating: Type.Number(),
      hourlyRating: Type.Record(Type.String(), Type.Number()),
    },
    { additionalProperties: false }
  )
);

export const SolunarPeriodsResponseSchema =
  DataResponseSchema(solunarPeriodSchema);

// Opcional: tipo para o retorno, se quiser inferir via TypeBox
export type SolunarPeriod = Static<typeof solunarPeriodSchema>;
