import { FastifyPluginAsync } from "fastify";
import { Value } from "@sinclair/typebox/value";
import {
  WeatherDataQuery,
  WeatherDataQuerySchema,
  WeatherDataResponseSchema,
} from "./schemas";
import { withErrorBoundary } from "../../../shared/libs/error-handler";
import { getAllWeatherData } from "../services";
import { AppResponse, HttpStatus } from "../../../shared/types";

export const weaterDataGetRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        tags: ["Weather"],
        summary: "Obtém dados meteorológicos por coordenada e data",
        querystring: WeatherDataQuerySchema,
        response: { 200: WeatherDataResponseSchema },
      },
    },
    async (request, reply) => {
      const result = await withErrorBoundary(async () => {
        const dto = request.query as WeatherDataQuery;

        const core = await getAllWeatherData({
          latitude: dto.latitude,
          longitude: dto.longitude,
          datetime: new Date(dto.datetime),
        });

        const response: AppResponse = {
          message: "Dados meteorológicos obtidos com sucesso",
          code: HttpStatus.OK,
          data: core,
        };

        if (!Value.Check(WeatherDataResponseSchema, response)) {
          fastify.log.warn({ response }, "Objeto de retorno fora do schema.");
        }

        return response;
      });

      return reply.code(result.code as any).send(result);
    }
  );
};
