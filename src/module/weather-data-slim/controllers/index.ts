import { FastifyPluginAsync } from "fastify";
import { weaterDataGetRoute } from "./weather-data-handler";
import { getRainDataGetRoute } from "./get-rain.handler";

export const weatherDataController: FastifyPluginAsync = async (fastify) => {
  fastify.register(
    async (r) => {
      await r.register(weaterDataGetRoute);
      await r.register(getRainDataGetRoute);
    },
    { prefix: "/weatherData" }
  );
};
