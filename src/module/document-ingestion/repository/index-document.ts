import OpenAI from "openai";
import { DocumentData } from "../contracts/in/contracts.in.params";
import { EmbeddingResponse } from "../contracts/out/contracts.out.response";
export function indexDocumentFunc() {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return async function indexDocument(
    doc: DocumentData
  ): Promise<EmbeddingResponse> {
    const embeddingResp = await client.embeddings.create({
      model: "text-embedding-3-small",
      input: doc.content,
    });

    const embedding = embeddingResp.data[0].embedding;
    const key = `doc:${doc.id}`;
    /*    await redis.hset(key, {
      content: doc.content,
      embedding: Buffer.from(new Float32Array(embedding).buffer),
    }); */

    return {
      key,
      content: doc.content,
      embedding: Buffer.from(new Float32Array(embedding).buffer),
    };
  };
}
