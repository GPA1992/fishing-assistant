export interface EmbeddingResponse {
  key: string;
  content: string;
  embedding: Buffer<ArrayBuffer>;
}
