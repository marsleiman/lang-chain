
import http from "http";
import { Server } from "socket.io";
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { response } from './new_chat.js'
// Definir __filename y __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// Configurar directorio de archivos estáticos
app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get('/holas', (req, res) => {
  res.send(response);
});

let promtAI = async (promt) => {
  const response = await openai.createCompletion({
    model: "gpt-3.5-turbo",
    prompt: promt,
    maxTokens: 300,
    temperature: 0.7,
    topP: 1,
  });
  text = response.data.choices[0].text;
  io.emit("chat message", text);
  return text;
};

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
    promtAI(msg);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
