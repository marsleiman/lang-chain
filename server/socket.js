const socketHandler = (io) => {
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
    })
}

export default socketHandler