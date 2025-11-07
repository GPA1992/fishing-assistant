import { FastifyPluginAsync } from "fastify";
import { Value } from "@sinclair/typebox/value";
import {
  GetRainDataQuery,
  GetRainDataQuerySchema,
  RainDataResponseSchema,
} from "./schemas";
import { withErrorBoundary } from "../../../shared/libs/error-handler";
import { AppResponse, HttpStatus } from "../../../shared/types";
import { getRainData } from "../services";

export const getRainDataGetRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    "/get-rain-data",
    {
      schema: {
        tags: ["Weather"],
        summary: "Obtém probabilidade e volume de chuva",
        querystring: GetRainDataQuerySchema,
        response: { 200: RainDataResponseSchema },
      },
    },
    async (request, reply) => {
      const result = await withErrorBoundary(async () => {
        const dto = request.query as GetRainDataQuery;

        const data = await getRainData({
          latitude: dto.latitude,
          longitude: dto.longitude,
          datetime: new Date(dto.datetime),
        });

        const response: AppResponse = {
          message: "Dados de chuva recuperados com sucesso",
          code: HttpStatus.OK,
          data,
        };

        if (!Value.Check(RainDataResponseSchema, response)) {
          fastify.log.warn({ response }, "Objeto de retorno fora do schema.");
        }

        return response;
      });

      return reply.code(result.code as any).send(result);
    }
  );
};
