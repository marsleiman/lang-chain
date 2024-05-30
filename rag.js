import { ChatOpenAI } from "@langchain/openai" 
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { createStuffDocumentsChain } from "langchain/chains/combine_documents"
import { createRetrievalChain } from "langchain/chains/retrieval"
import { Document } from "@langchain/core/documents"
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { OpenAIEmbeddings } from "@langchain/openai"
import { FaissStore } from "@langchain/community/vectorstores/faiss";

import * as dotenv from 'dotenv'
dotenv.config()

const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0
})

const loader = new DirectoryLoader(
    "knowledge_base",
    {
      ".txt": (path) => new TextLoader(path),
    }
  );

const docs = await loader.load();

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1024,
  chunkOverlap: 200,
})

const splited = await splitter.splitDocuments(docs)
const embeddings = new OpenAIEmbeddings()


const vectorStore = await FaissStore.fromDocuments(
  splited,
  embeddings
);


const retriever = vectorStore.asRetriever({
  k: 2
})

const prompt = ChatPromptTemplate.fromTemplate(
  `Contestá la pregunta del usuario. 
  Context: {context}
  Pregunta: {input}
  `
)

const chain = await createStuffDocumentsChain({
    llm: model,
    prompt: prompt
})

const retrievalChain = await createRetrievalChain({
  combineDocsChain: chain,
  retriever: retriever
})

const response = await retrievalChain.invoke({
  input: "Cómo se configura un almacén?"
})

/*const response = await retrievalChain.invoke({
  input: "Cómo doy de alta un paciente?"
})*/


console.log(response.answer)

