// servidor express con trafico de datos proviniendo del server http padre
import express from 'express';
import proxies from '../proxie/proxies.js';
export default function App() {
    const app = express()

    // implementa rucas
    app.get('/api', (req, res) => {
        res.send('Hello World');
    });

    // implementa proxies
    proxies(app);

    // retorna la instancia de express
    return app;
}