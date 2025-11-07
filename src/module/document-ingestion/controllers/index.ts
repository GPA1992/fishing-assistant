import { FastifyPluginAsync } from "fastify";
import { documentInjestionHandler } from "./document-ingestion-handler";

export const documentIngestController: FastifyPluginAsync = async (fastify) => {
  fastify.register(
    async (r) => {
      await r.register(documentInjestionHandler);
    },
    { prefix: "/document" }
  );
};
