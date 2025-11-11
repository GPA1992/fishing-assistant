import { FastifyPluginAsync } from "fastify";
import { getDayScoreRoute } from "./get-day-score.handler";

export const getScore: FastifyPluginAsync = async (fastify) => {
  fastify.register(
    async (r) => {
      await r.register(getDayScoreRoute);
    },
    { prefix: "/score" }
  );
};
