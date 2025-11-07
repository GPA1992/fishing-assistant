// plugins/redis.ts
import fp from "fastify-plugin";
import fastifyRedis from "@fastify/redis";
import type { FastifyInstance } from "fastify";

export default fp(async function redisPlugin(app: FastifyInstance) {
  app.register(fastifyRedis, {
    url: process.env.REDIS_URL || "redis://localhost:6379",
    // ioredis é o client por trás do plugin
  });

  app.addHook("onReady", async () => {
    await ensureRedisIndex(app);
  });
});

async function ensureRedisIndex(app: FastifyInstance): Promise<void> {
  const redis: any = app.redis;
  const indexName = "idx:docs_v1";
  const aliasName = "idx:docs_current";

  try {
    try {
      await redis.call(
        "FT.CREATE",
        indexName,
        "ON",
        "HASH",
        "PREFIX",
        "1",
        "doc:",
        "SCHEMA",
        "content",
        "TEXT",
        "embedding",
        "VECTOR",
        "FLAT",
        "6",
        "TYPE",
        "FLOAT32",
        "DIM",
        "1536",
        "DISTANCE_METRIC",
        "COSINE"
      );
      app.log.info(`Índice ${indexName} criado.`);
    } catch (err: any) {
      const msg = err?.message ?? String(err);
      if (msg.includes("Index already exists")) {
        app.log.info(`Índice ${indexName} já existe.`);
      } else {
        app.log.error({ err }, "Erro ao criar índice");
        throw err;
      }
    }

    try {
      await redis.call("FT.ALIASUPDATE", aliasName, indexName);
      app.log.info(`Alias ${aliasName} atualizado para ${indexName}.`);
    } catch (err: any) {
      const msg = err?.message ?? String(err);
      if (msg.includes("Alias does not exist")) {
        await redis.call("FT.ALIASADD", aliasName, indexName);
        app.log.info(`Alias ${aliasName} criado -> ${indexName}.`);
      } else {
        app.log.error({ err }, "Erro ao atualizar alias");
        throw err;
      }
    }
  } catch {
    // propaga para falhar startup se quiser
  }
}
