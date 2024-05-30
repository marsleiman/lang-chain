import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";

const loader = new DirectoryLoader(
    "knowledge_base",
    {
      ".txt": (path) => new TextLoader(path),
    }
  );
  const docs = await loader.load();
  console.log({ docs });

