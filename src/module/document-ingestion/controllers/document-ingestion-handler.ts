import { FastifyPluginAsync } from "fastify";
import { Value } from "@sinclair/typebox/value";
import { VoidResponseSchema } from "../../../shared/schemas";
import { withErrorBoundary } from "../../../shared/libs/error-handler";
import { makeIngestDocument } from "../services";
import { AppResponse, HttpStatus } from "../../../shared/types";

export const documentInjestionHandler: FastifyPluginAsync = async (fastify) => {
  fastify.post(
    "/run",
    {
      schema: {
        tags: ["Document"],
        summary: "Cria documentos no redis",
        response: {
          200: VoidResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const ingestDocument = makeIngestDocument(fastify.redis);
      const result = await withErrorBoundary(async () => {
        const app = ingestDocument();
        const response: AppResponse = {
          data: app,
          message: "Documentos indexados com sucesso!",
          code: HttpStatus.OK,
        };

        if (!Value.Check(VoidResponseSchema, response)) {
          fastify.log.warn({ response }, "Schema fora do esperado!");
        }

        return response;
      });

      return reply.code(result.code as any).send(result);
    }
  );
};
