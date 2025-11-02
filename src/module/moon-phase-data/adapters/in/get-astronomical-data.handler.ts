import { FastifyPluginAsync } from "fastify";
import { Value } from "@sinclair/typebox/value";
import { withErrorBoundary } from "../../../../shared/libs/error-handler";
import { AppResponse, HttpStatus } from "../../../../shared/types";
import {
  astronomicalDataQueryDto,
  astronomicalDataQuerySchema,
  MoonPhaseResponseSchema,
} from "./schemas";
import { getAstronomicalData } from "../../application";

export const getAstronomicalDataHandler: FastifyPluginAsync = async (
  fastify
) => {
  fastify.get(
    "/moon-phases",
    {
      schema: {
        tags: ["Astronomical Data"],
        summary: "Lista fases da lua",
        querystring: astronomicalDataQuerySchema,
        response: {
          200: MoonPhaseResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const result = await withErrorBoundary(async () => {
        const { datetime, latitude, longitude } =
          request.query as astronomicalDataQueryDto;

        const app = await getAstronomicalData({
          datetime: new Date(datetime),
          latitude: Number(latitude),
          longitude: Number(longitude),
        });

        const response: AppResponse = {
          data: app,
          message: "Fases da lua retorna com sucesso!",
          code: HttpStatus.OK,
        };

        if (!Value.Check(MoonPhaseResponseSchema, response)) {
          fastify.log.warn({ response }, "Schema fora do esperado!");
        }

        return response;
      });

      return reply.code(result.code as any).send(result);
    }
  );
};
