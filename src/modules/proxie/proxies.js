// Función que se encarga de redirigir las peticiones a los servidores correspondientes
import { fileURLToPath } from 'url';
import express from 'express';
let __dirname = path.dirname(fileURLToPath(import.meta.url));

import proxy from '../../libs/proxy.js';
import workers from '../workers/workers.js';
import path from 'path';
export default function proxies(app) {
    // implementa rutas para reaccionar a los builds de react u cualquier otro framework
    app.use("/cli", express.static(path.resolve(__dirname, '../../cli')));
    
    // implementa rutas para reaccionar peticiones al server stun
    app.use("/stun", (req, res) => {
        proxy(req, res, Number(workers.stunServer_port));
    });
    
    // implementa rutas para reaccionar peticiones al server react [en este caso se redirige a la ruta raíz]
    // app.use((req, res) => {
    //     proxy(req, res, Number(workers.react_port));
    // });
    
    app.use(express.static(path.resolve(__dirname, '../../../build/tets')));
}