import { DocumentData } from "../contracts/in/contracts.in.params";
import { EmbeddingResponse } from "../contracts/out/contracts.out.response";

export type DocumentIngestionPort = {
  readAll: () => Promise<DocumentData[]>;
  indexDocument: (doc: DocumentData) => Promise<EmbeddingResponse>;
};
