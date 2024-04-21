// Script de control de hilos secundario react
// este se encarga de ejecutar el script de inicio del servidor react y enviar la url del servidor al servidor padre

import { spawn } from 'child_process';
import { parentPort } from 'worker_threads';
import path from 'path';
import { fileURLToPath } from 'url';
let __dirname = path.dirname(fileURLToPath(import.meta.url));
parentPort.on('message', async (message) => {
    react(message);
});
async function react(message) {
    const patch = path.resolve(__dirname, message.Path);
    try {
        // hace ejecución del path de "instrucciones" que se le envía al hilo padre, de esta forma iniciando el proyecto react
        const child = spawn(patch, [], { shell: true });

        // obtiene datos en runtime del servidor react
        child.stdout.on('data', (data) => {
            // linea de código que se encarga de extraer el puerto del servidor react
            const regex = /[^a-zA-Z0-9]/g;
            let response = data.toString();
            let hostStyles = String(response.split('http://localhost:')[1]).split('/')[0]
            let Extract_port = hostStyles.replace(regex, '');
            if (Extract_port!=undefined) {
                const port = Extract_port.split('22m')[0].split('m')[1];
                if (port!=undefined) {
                    parentPort.postMessage({
                        code: "success",
                        message: "child process executed",
                        data: `http://localhost:${port}`,
                        port: port
                    });
                }
            }
        });

        // obtiene errores en runtime del servidor react
        // child.stderr.on('data', (data) => {
        //     parentPort.postMessage({
        //         code: "error",
        //         message: "child process errored",
        //         data: data.toString()
        //     })
        // });

        // obtiene el estado de finalización del servidor react
        // child.on('close', (code) => {
        //     parentPort.postMessage({
        //         code: "closed",
        //         message: "child process exited with code",
        //         data: code.toString()
        //     })
        // });

    } catch (error) {
        parentPort.postMessage({error})
    }
}




// NOTES SAVED
// nota para recordar la estructura de los hilos secundarios y la comunicación con el servidor padre
// const child = spawn('dir', ['']);