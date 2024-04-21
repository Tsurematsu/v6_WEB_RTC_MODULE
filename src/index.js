import http from 'http';
import App from './modules/express/express.js';
import dotenv from 'dotenv'; dotenv.config();
import workers from './modules/workers/workers.js';

// Importación de logs, elementos para control de impresión en consola, funciones para imprimir mensajes en consola
import log from './logs/messages/log.js';


// Declaración de variables implementación sever padre (http)
async function Main(){
    // Hilos secundarios [React, StunServer] 
    await workers.run();

    // Creación del servidor padre implementando el objeto de express
    const server = http.createServer(App())

    const PORT = process.env.PORT || 3000;
    
    server.listen(PORT, () => {
        log.server(`http://localhost:${PORT}`);
    });
}
Main();
