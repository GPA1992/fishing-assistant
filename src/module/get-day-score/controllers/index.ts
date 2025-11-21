import { FastifyPluginAsync } from "fastify";
import { postDayScoreRoute } from "./post-day-score.handler";
import { postScoreTestRoute } from "./post-score-test.handler";

export const getScore: FastifyPluginAsync = async (fastify) => {
  fastify.register(
    async (r) => {
      await r.register(postDayScoreRoute);
      await r.register(postScoreTestRoute);
    },
    { prefix: "/score" }
  );
};
