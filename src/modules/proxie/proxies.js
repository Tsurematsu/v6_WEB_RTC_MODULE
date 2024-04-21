// Función que se encarga de redirigir las peticiones a los servidores correspondientes

import proxy from '../../libs/proxy.js';
import workers from '../workers/workers.js';
export default function proxies(app) {

    // implementa rutas para reaccionar peticiones al server stun
    app.use("/stun", (req, res) => {
        proxy(req, res, Number(workers.stunServer_port));
    });

    // implementa rutas para reaccionar peticiones al server react [en este caso se redirige a la ruta raíz]
    app.use((req, res) => {
        proxy(req, res, Number(workers.react_port));
    });
}