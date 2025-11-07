import * as path from "path";

import { readAllDocumentsFunc } from "./read-all-documents";
import { indexDocumentFunc } from "./index-document";
import { DocumentIngestionPort } from "../domain/document-ingestion.port";

export function documentIngestionProvider(): DocumentIngestionPort {
  const docsFolder = path.resolve(process.cwd(), "src/documents/chunks");

  return {
    readAll: readAllDocumentsFunc({ docsFolder }),
    indexDocument: indexDocumentFunc(),
  };
}
