import * as fs from "fs/promises";
import * as path from "path";
import { DocumentData } from "../contracts/in/contracts.in.params";

type Deps = {
  docsFolder: string;
};

export function readAllDocumentsFunc({ docsFolder }: Deps) {
  return async function readAll(): Promise<DocumentData[]> {
    const files = await fs.readdir(docsFolder);

    const markdownFiles = files.filter((f) => f.endsWith(".md"));

    const documents = await Promise.all(
      markdownFiles.map(async (file) => {
        const content = await fs.readFile(path.join(docsFolder, file), "utf-8");
        const id = path.parse(file).name;
        return { id, content };
      })
    );

    return documents;
  };
}
