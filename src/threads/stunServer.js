// iniciamos el servidor STUN/TURN en un worker thread
// este se encarga de descubrir la dirección IP y el puerto de un cliente, y de abrir un puerto en el servidor para que el cliente pueda conectarse
import Turn from 'node-turn';
import { parentPort } from 'worker_threads';
function startStunServer() {
    let server;
    parentPort.on('message', async (message) => {
        try {
            const username = message.username;
            const password = message.password;
            const port = message.port
            server = new Turn({ authMech: 'long-term', credentials: {[username]: password}, debugLevel: 'TURN', listeningPort: port});  
            await server.start();
            parentPort.postMessage({
                status: 'success',
                message: 'Servidor TURN iniciado correctamente en el puerto ' + port,
                port: port,
                url: `turn:localhost:${port?port:3478}`
            });
        } catch (error) {
            parentPort.postMessage({
                status: 'error',
                message: 'Error al iniciar el servidor TURN',
                error: error,
            });
        }
    });
}
startStunServer();