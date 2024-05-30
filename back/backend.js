const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { Configuration, OpenAIApi } = require("openai");
const dotenv = require("dotenv");
require("../new_chat.js");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
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
