/*

EL PUNTO DE ENTRADA ES SERVER.JS!!!!!! -> ex backend.js  

en un .env pone PORT=<puerto que mas te guste>
EN LA TERMINAL NPM RUN DEV Y A DISFRUTAR!

*/
import http from "http";
import express from 'express';
import { Server } from "socket.io";
import socketHandler from './socket.js'
import { PORT } from '../config/envConfig.js'
import routerMaster from './routes/index.js'
import staticFiles from "./middlewares/staticFiles.js";


const app = express();
const server = http.createServer(app);
const io = new Server(server);

//usar los archivos estaticos anula la posibilidad de llegar mediante rutas
//el problema de llegar mediante rutas es que no hace la importacion de los estilos ni el javascript
staticFiles(app);
app.use(routerMaster);

socketHandler(io)

server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
