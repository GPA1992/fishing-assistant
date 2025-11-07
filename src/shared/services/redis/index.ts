import Redis from "ioredis";

export async function ensureRedisIndex(): Promise<void> {
  const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
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
      console.log(`Índice ${indexName} criado com sucesso.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("Index already exists")) {
        console.log(`Índice ${indexName} já existe, prosseguindo.`);
      } else {
        console.error("Erro ao criar índice Redis:", err);
        throw err;
      }
    }

    try {
      await redis.call("FT.ALIASUPDATE", aliasName, indexName);
      console.log(`Alias ${aliasName} atualizado para ${indexName}.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("Alias does not exist")) {
        await redis.call("FT.ALIASADD", aliasName, indexName);
        console.log(`Alias ${aliasName} criado e apontando para ${indexName}.`);
      } else {
        console.error("Erro ao atualizar alias Redis:", err);
        throw err;
      }
    }
  } finally {
    redis.disconnect();
  }
}
