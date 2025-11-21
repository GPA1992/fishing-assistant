import { calculateScore } from "@env-data/scriptsV2";
import { SpeciesId } from "@env-data/scriptsV2/schema/types";
import { FastifyPluginAsync } from "fastify";

import { withErrorBoundary } from "../../../shared/libs/error-handler";
import { AppResponse, HttpStatus } from "../../../shared/types";
import { ScoreTestBody, ScoreTestBodySchema } from "./schemas";

const describeMoonPhase = (illumination?: number) => {
  const value = Math.max(0, Math.min(1, illumination ?? 0));
  if (value < 0.03) return "New Moon";
  if (value < 0.25) return "Waxing Crescent";
  if (value < 0.27) return "First Quarter";
  if (value < 0.48) return "Waxing Gibbous";
  if (value < 0.52) return "Full Moon";
  if (value < 0.73) return "Waning Gibbous";
  if (value < 0.77) return "Last Quarter";
  return "Waning Crescent";
};

export const postScoreTestRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post(
    "/score-test",
    {
      schema: {
        tags: ["Score Diário"],
        summary: "Calcula um score a partir de um payload simples (score test).",
        body: ScoreTestBodySchema,
      },
    },
    async (request, reply) => {
      const result = await withErrorBoundary(async () => {
        const dto = request.body as ScoreTestBody;
        const speciesId: SpeciesId = (dto.speciesId ?? "traira") as SpeciesId;
        const instant = new Date(dto.time);
        const hasValidTime = !Number.isNaN(instant.getTime());
        const localHour = hasValidTime ? instant.getUTCHours() : 12;
        const localHourDec = hasValidTime
          ? localHour + instant.getUTCMinutes() / 60
          : 12;
        const total = dto.total ?? dto.rain ?? 0;
        const showers = dto.showers ?? 0;
        const pressureTrend6h = Number.isFinite(dto.pressureTrend6h as number)
          ? dto.pressureTrend6h
          : undefined;

        const score = calculateScore(speciesId, {
          temperature: dto.temperature,
          humidity: dto.humidity,
          pressure: dto.pressure,
          windSpeed: dto.windSpeed,
          probability: dto.probability,
          total,
          showers,
          localHour,
          localHourDec,
          pressureTrend6h,
          moonIllumination: dto.moonIllumination,
        });

        const response: AppResponse = {
          message: "Score",
          code: HttpStatus.OK,
          data: {
            time: dto.time,
            temperature: dto.temperature,
            humidity: dto.humidity,
            pressure: dto.pressure,
            windSpeed: dto.windSpeed,
            probability: dto.probability,
            rain: dto.rain ?? total,
            showers,
            total,
            pressureTrend6h: dto.pressureTrend6h,
            score,
            moonPhase: describeMoonPhase(dto.moonIllumination),
            speciesId,
          },
        };

        return response;
      });

      return reply.code(result.code as any).send(result);
    }
  );
};
