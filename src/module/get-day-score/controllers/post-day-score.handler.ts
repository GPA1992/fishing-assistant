import { FastifyPluginAsync } from "fastify";
/* import { Value } from "@sinclair/typebox/value"; */

import { withErrorBoundary } from "../../../shared/libs/error-handler";
import { AppResponse, HttpStatus } from "../../../shared/types";
import { ScoreDataBody, ScoreDataBodySchema } from "./schemas";
import { getScoreData } from "../services";

export const postDayScoreRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post(
    "/post-score",
    {
      schema: {
        tags: ["Score Diário"],
        summary: "Obtém o score diário com base em dados climáticos.",
        body: ScoreDataBodySchema,
      },
    },
    async (request, reply) => {
      const result = await withErrorBoundary(async () => {
        const dto = request.body as ScoreDataBody;
        const date = new Date();
        date.setUTCFullYear(date.getUTCFullYear());
        date.setUTCMonth(parseInt(dto.targetMonth) - 1);
        date.setUTCDate(parseInt(dto.targetDay));

        const data = await getScoreData({
          latitude: dto.latitude,
          longitude: dto.longitude,
          datetime: date,
          fishList: dto.fishList as any,
        });

        const response: AppResponse = {
          message: "Score",
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
