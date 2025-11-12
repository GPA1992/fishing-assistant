import { FastifyPluginAsync } from "fastify";
import { weaterDataGetRoute } from "./weather-data-handler";

export const weatherDataController: FastifyPluginAsync = async (fastify) => {
  fastify.register(
    async (r) => {
      await r.register(weaterDataGetRoute);
    },
    { prefix: "/weatherData" }
  );
};
