import { FastifyPluginAsync } from "fastify";
import { postDayScoreRoute } from "./post-day-score.handler";

export const getScore: FastifyPluginAsync = async (fastify) => {
  fastify.register(
    async (r) => {
      await r.register(postDayScoreRoute);
    },
    { prefix: "/score" }
  );
};
