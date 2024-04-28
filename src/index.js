import dotenv from 'dotenv';
import http from 'http';
import Socket from './libs/Socket/Socket.js';
import log from './libs/log.js';
import App from './modules/express/express.js';
import workers from './modules/workers/workers.js';
dotenv.config();
// Importación de logs, elementos para control de impresión en consola, funciones para imprimir mensajes en consola
import testBrowser from './libs/testBrowser.js';

// Declaración de variables implementación sever padre (http)
async function Main(){
    clearConsole();
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
    
    let newPages = await testBrowser('http://localhost:8000/',
        (msg, index)=>log['browser_' + index](msg.text()));
    await newPages(1);
    await newPages(2);
    await newPages(3);
    // await newPages(4);
}
Main();

























function clearConsole() {
    console.log("\n\n\n\n\n\n\n\n\n\n\n\n");
    console.log("\n\n\n\n\n\n\n\n\n\n\n\n");
    console.log("\n\n\n\n\n\n\n\n\n\n\n\n");
    process.stdout.write('\x1B[2J\x1B[0f');
}