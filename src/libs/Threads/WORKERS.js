// Encargado de ejecutar los workers en hilos secundarios
import { Worker } from 'worker_threads';
import path from 'path';
import { fileURLToPath } from 'url';
let __dirname = path.dirname(fileURLToPath(import.meta.url));
export default function WORKERS() {
    this.event = ()=>{};
    this.send = ()=>{}
    // recibe como parámetro un objeto con la ruta del archivo script y la instrucción a ejecutar
    this.run = async ({Path, instruction}) => {
        const worker = new Worker(path.resolve(__dirname, Path));
        worker.postMessage(instruction);
        this.send = (data) => worker.postMessage(data);

        // se espera a que el worker termine la tarea y se resuelve la promesa o manse alguna respuesta en runtime
        return await new Promise((resolve, _) => {
            worker.on('message', (result) => {
                this.event(result);
                resolve(result);
            });
        });
    }
}