import { FastifyPluginAsync } from "fastify";
import { getSolunarPeriodsHandler } from "./sololunar-periods-handler";

export const sololunarPeriodsController: FastifyPluginAsync = async (
  fastify
) => {
  fastify.register(
    async (r) => {
      await r.register(getSolunarPeriodsHandler);
    },
    { prefix: "/sololunar" }
  );
};
