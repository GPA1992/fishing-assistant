import { FastifyPluginAsync } from "fastify";
/* import { Value } from "@sinclair/typebox/value"; */

import { withErrorBoundary } from "../../../shared/libs/error-handler";
import { AppResponse, HttpStatus } from "../../../shared/types";
import { ScoreDataQuery, ScoreDataQuerySchema } from "./schemas";
import { getScoreData } from "../services";

export const getDayScoreRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    "/get-score",
    {
      schema: {
        tags: ["Score Diário"],
        summary: "Obtém o score diário com base em dados climáticos.",
        querystring: ScoreDataQuerySchema,
      },
    },
    async (request, reply) => {
      const result = await withErrorBoundary(async () => {
        const dto = request.query as ScoreDataQuery;
        const date = new Date();
        date.setUTCFullYear(date.getUTCFullYear());
        date.setUTCMonth(parseInt(dto.targetMonth) - 1);
        date.setUTCDate(parseInt(dto.targetDay));
        date.setUTCHours(parseInt(dto.targetHour), 0, 0, 0);
        const data = await getScoreData({
          latitude: dto.latitude,
          longitude: dto.longitude,
          datetime: date,
          timezone: dto.timezone,
        });

        const response: AppResponse = {
          message: "Dados de chuva recuperados com sucesso",
          code: HttpStatus.OK,
          data,
        };
        /* 
        if (!Value.Check(RainDataResponseSchema, response)) {
          fastify.log.warn({ response }, "Objeto de retorno fora do schema.");
        } */

        return response;
      });

      return reply.code(result.code as any).send(result);
    }
  );
};
