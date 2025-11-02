import { FastifyPluginAsync } from "fastify";
import { getAstronomicalDataHandler } from "./get-astronomical-data.handler";

export const astronomicalDataController: FastifyPluginAsync = async (
  fastify
) => {
  fastify.register(
    async (r) => {
      await r.register(getAstronomicalDataHandler);
    },
    { prefix: "/astronomical-data" }
  );
};
