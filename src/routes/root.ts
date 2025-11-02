import { FastifyPluginAsync } from "fastify";
import { astronomicalDataController } from "../module/moon-phase-data/adapters/in";

const root: FastifyPluginAsync = async (fastify): Promise<void> => {
  await fastify.register(astronomicalDataController);
};

export default root;
