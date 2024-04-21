import path from 'path';
import { fileURLToPath } from 'url';
import { Worker } from 'worker_threads';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export default new function WORKERS() {
    this.Stun_Server = async function() {
        const worker_STUN = new Worker(path.resolve(__dirname, "./servers/stunServer.js"));
        worker_STUN.postMessage({ username: 'username', password: 'password', port: 3478});    
        return await new Promise((resolve, _) => {worker_STUN.on('message', (result) => {resolve(result);});});
    }    
}