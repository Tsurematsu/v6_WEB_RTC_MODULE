// Archivo principal de la clase workers, se encarga de manejar los hilos secundarios y la comunicación con el servidor
// también se encarga de almacenar los puertos de los servidores para redirigir las peticiones

// -----------------------------------------------------------------------------------------------
// Nota: Mejorar sistema y estructura de workers, cada worker debe tener su propio archivo y no estar en un solo archivo o
// implementarse como objetos independientes, para mejorar la escalabilidad y mantenimiento del código
// -----------------------------------------------------------------------------------------------

import WORKERS from '../../libs/Threads/WORKERS.js';
import log from '../../logs/messages/log.js';

export default new class workers{
    react_port="";
    // Inicialización de puerto del servidor stun y react
    async run(){
        await this.stunServer();
        // await this.react();
    }

    // Inicialización de servidor stun
    async stunServer() {
        const stunServer =  new WORKERS();
        const port = 3478;
        // envía el path del archivo script correspondiente al de inicio del servidor stun, el cual manejara la lógica de la aplicación
        // se envía la ruta del archivo script para que el hilo secundario pueda ejecutarlo
        // Nota: se debe controlar la ruta del archivo script
        // Nota: este script recibe el usuario y contraseña para el servidor stun ademas del puerto
        let responseRuntime = await stunServer.run({
            Path: '../../threads/stunServer.js',
            instruction: { 
                username: 'username', 
                password: 'password', 
                port
            }
        });
        this.stunServer_port = port;
        log.stunServer(responseRuntime.url);
    }

    /*  Inicialización de servidor react
        envía el path del archivo script correspondiente al de inicio del servidor react, el cual manejara la lógica de la aplicación
        se envía la ruta del archivo script para que el hilo secundario pueda ejecutarlo
        Nota: se debe controlar la ruta del archivo script
        Nota: este scrip secundario en las instrucciones solo se encarga de controlar la ejecución interna del proyecto de react 
    */ 
    async react() {
        const react = new WORKERS();
        let responseRuntime = await react.run({
            Path: '../../threads/react.js',
            instruction: { 
                Path: '../../project/test/start.bat'
            }
        });
        this.react_port = responseRuntime.port;
        log.react(responseRuntime.data.trim());
    }
}
