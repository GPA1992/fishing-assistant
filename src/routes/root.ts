import { FastifyPluginAsync } from "fastify";
import { astronomicalDataController } from "../module/moon-phase-data/adapters/in";
import { sololunarPeriodsController } from "../module/sololunar-periods/adapters/in";
import { weatherDataController } from "../module/weather-data-slim/controllers";
import { documentIngestController } from "../module/document-ingestion/controllers";

const root: FastifyPluginAsync = async (fastify): Promise<void> => {
  await fastify.register(astronomicalDataController);
  await fastify.register(sololunarPeriodsController);
  await fastify.register(documentIngestController);
  await fastify.register(weatherDataController);
};

export default root;
