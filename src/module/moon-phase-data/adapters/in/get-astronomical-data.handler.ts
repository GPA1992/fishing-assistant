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
        const dto = request.query as astronomicalDataQueryDto;
        const date = new Date();
        date.setUTCFullYear(date.getUTCFullYear());
        date.setUTCMonth(parseInt(dto.targetMonth) - 1);
        date.setUTCDate(parseInt(dto.targetDay));
        date.setUTCHours(parseInt(dto.targetHour), 0, 0, 0);

        const app = await getAstronomicalData({
          latitude: dto.latitude,
          longitude: dto.longitude,
          datetime: date,
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
