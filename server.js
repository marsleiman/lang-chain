/*

EL PUNTO DE ENTRADA ES SERVER.JS!!!!!! -> ex backend.js  

en un .env pone PORT=<puerto que mas te guste>
EN LA TERMINAL NPM RUN DEV Y A DISFRUTAR!

*/
import http from "http";
import { Server } from "socket.io";
import express from 'express';
import  path  from 'path';
import { PORT } from './config/envConfig.js'

const __dirname = path.resolve(); // Solución para obtener __dirname en ES Modules

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

io.on('connection', (socket) => {
  console.log('Primer paso: se conectó un usuario');
  
  socket.on('disconnect', () => {
    console.log('Se desconectó un usuario');
  });

  socket.on('chat message', (msg) => {
    console.log("Tercer Paso: El servidor recibe lo que el usuario haya escrito")
    console.log("Aca deberíamos enviarle el mensaje a OPENAI y que haga su magia")
    console.log("Cuarto Paso: El servidor devuelve el mensaje hacia la pc del cliente.")
    io.emit('chat message', `Me escribiste: ${msg}`);
  });
});


server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
