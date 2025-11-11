// routes/sololunar/infra/http/get-sololunar-periods.handler.ts
import { FastifyPluginAsync } from "fastify";
import { Value } from "@sinclair/typebox/value";
import { withErrorBoundary } from "../../../../shared/libs/error-handler";
import { AppResponse, HttpStatus } from "../../../../shared/types";
import {
  solunarQuerySchema,
  SolunarPeriodsResponseSchema,
  SolunarQueryParams,
} from "./schemas";
import { getSoloLunarPeriods } from "../../application";

export const getSolunarPeriodsHandler: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    "/periods",
    {
      schema: {
        tags: ["Astronomical Data"],
        summary: "Lista períodos solunares",
        querystring: solunarQuerySchema,
        response: {
          200: SolunarPeriodsResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const result = await withErrorBoundary(async () => {
        const {
          latitude,
          longitude,
          timezone,
          targetDay,
          targetHour,
          targetMonth,
        } = request.query as SolunarQueryParams;

        const date = new Date();
        date.setUTCFullYear(date.getUTCFullYear());
        date.setUTCMonth(parseInt(targetMonth) - 1);
        date.setUTCDate(parseInt(targetDay));
        date.setUTCHours(parseInt(targetHour), 0, 0, 0);
        const app = await getSoloLunarPeriods({
          latitude: Number(latitude),
          longitude: Number(longitude),
          date: date,
          timezone: Number(timezone),
        });

        const response: AppResponse = {
          data: app,
          message: "Períodos solunares retornados com sucesso!",
          code: HttpStatus.OK,
        };

        if (!Value.Check(SolunarPeriodsResponseSchema, response)) {
          fastify.log.warn({ response }, "Schema fora do esperado!");
        }

        return response;
      });

      return reply.code(result.code as any).send(result);
    }
  );
};
