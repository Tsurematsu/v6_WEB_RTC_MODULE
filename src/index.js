import http from 'http';
import App from './modules/express/express.js';
import dotenv from 'dotenv'; dotenv.config();
import workers from './modules/workers/workers.js';
import Socket from './libs/Socket/Socket.js';
// Importación de logs, elementos para control de impresión en consola, funciones para imprimir mensajes en consola
import log from './logs/messages/log.js';


// Declaración de variables implementación sever padre (http)
async function Main(){
    const PORT = process.env.PORT || 3000;
    // Hilos secundarios [React, StunServer] 
    await workers.run();
    // Creación del servidor padre implementando el objeto de express
    const server = http.createServer(App())
    // Creación del servidor hijo implementando el objeto de socket.io
    const socket = Socket(server);
    server.listen(PORT, () => {
        log.server(`http://localhost:${PORT}`);
    });
}
Main();
