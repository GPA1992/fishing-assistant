import { DocumentIngestionPort } from "../domain/document-ingestion.port";
import type { Redis } from "ioredis";
export type IngestDocuments = () => Promise<void>;

export function ingestDocumentsUseCase(
  provider: DocumentIngestionPort,
  redis: Redis
): IngestDocuments {
  return async function ingestDocuments(): Promise<void> {
    const documents = await provider.readAll();

    /*  for (const doc of documents) {
      const embedding = await provider.indexDocument(doc);
      console.log(`Documento ${doc.id} indexado.`);

      await redis.hset(embedding.key, {
        content: embedding.content,
        embedding: embedding.embedding,
      });
    } */
    await Promise.all(
      documents.map(async (doc) => {
        const embedding = await provider.indexDocument(doc);
        console.log(`Documento ${doc.id} indexado.`);

        await redis.hset(embedding.key, {
          content: embedding.content,
          embedding: embedding.embedding,
        });
      })
    );
  };
}
