import { documentIngestionProvider } from "../repository";
import { ingestDocumentsUseCase } from "./document-ingestion.use-case";
import type { Redis } from "ioredis";
// precisa passar);

const makeIngestDocument = (redis: Redis) => {
  const ingestDocumentPort = documentIngestionProvider();
  const ingestDocument = ingestDocumentsUseCase(ingestDocumentPort, redis);
  return ingestDocument;
};

export { makeIngestDocument };
