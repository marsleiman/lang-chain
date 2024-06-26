import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { MessagesPlaceholder } from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

import * as dotenv from "dotenv";
dotenv.config();

// Instancia el modelo. Temperatura 0 para que sea lo menos creativo posible
const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0,
  verbose: true,
});

// Carga los documentos (Llevarlo a otro módulo)
const loader = new DirectoryLoader("./documents", {
  ".txt": (path) => new TextLoader(path),
  ".csv": (path) => new CSVLoader(path),
});

const docs = await loader.load();

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1024,
  chunkOverlap: 200,
});

const slited = await splitter.splitDocuments(docs);
const embeddings = new OpenAIEmbeddings();

// Crea el vector de incrustaciones
const vectorStore = await FaissStore.fromDocuments(slited, embeddings);

const retriever = vectorStore.asRetriever({ k: 3 });

// Instrucciones para que reformule la pregunta teniendo en cuenta el historial
const retrieverPrompt = ChatPromptTemplate.fromMessages([
  new MessagesPlaceholder("chat_history"),
  ["user", "{input}"],
  [
    "user",
    "A partir de la conversación de arriba, generá una nueva pregunta que pueda ser entendida sin el historial de la conversación",
  ],
]);

// Si no recibe un historial, le pasa la consulta directamente al retriever
const retrieverChain = await createHistoryAwareRetriever({
  llm: model,
  retriever,
  rephrasePrompt: retrieverPrompt,
});

// Instrucciones generales para el bot
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "Eres un asistente que contesta preguntas de nuestra base de conocimiento. Responde la pregunta del usuario a partir del siguiente contexto: {context}. No busques información que no esté en el contexto de tu base de conocimiento para contestar preguntas. No contestes preguntas sobre temas que no estén en la base de conocimiento.",
  ],
  new MessagesPlaceholder("chat_history"),
  ["user", "{input}"],
]);

const chain = await createStuffDocumentsChain({
  llm: model,
  prompt: prompt,
});

const conversationChain = await createRetrievalChain({
  combineDocsChain: chain,
  retriever: retrieverChain,
});

// Está simulando el historial
// Tendríamos que tener una función que reciba un input, invoque la cadena y guarde los mensajes en el chat
const historial = [
  new HumanMessage("Me llamo Juan"),
  new AIMessage("Hola Juan, ¿en qué puedo ayudarte?"),
];

export const response = await conversationChain.invoke({
  chat_history: historial,
  input: "Cómo configuro un almacén?",
});

console.log(response.answer);