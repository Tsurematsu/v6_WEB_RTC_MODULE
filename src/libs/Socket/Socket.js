import { Server } from "socket.io";
import log  from "../log.js";
export default function Socket(server) {
    const io = new Server(server);
    const Cliente = {};
    const Cache_clients = {};
    io.on('connection', (socket) => {
      log.socket_io('cliente conectado', socket.id);
      Cache_clients[socket.id] = socket;
      
      socket.on('join', (data) => {
        log.socket_join("--------->", data);
      });

      socket.on('disconnect', async () => {
        console.log('cliente desconectado', socket.id);
        delete Cache_clients[socket.id];  
      });

      // 

    });
    return io;
}


      // clientConnected.on('join', (entry) => {
        //   const room = String(entry.room??entry).trim();
        //   clientConnected.join(room);
        //   clientConnected.to(room).emit('join', {sender: clientConnected.id});
        // });   
        
        // clientConnected.on('offer', (entry) => {
        //   clientConnected.to(entry.room).emit('offer', entry.data);
        // });

        // clientConnected.on('answer', (entry) => {
        //   clientConnected.to(entry.room).emit('answer', entry.data);
        // });

        // clientConnected.on('candidate', (entry) => {
        //   clientConnected.to(entry.room).emit('candidate', entry.data);
        // });

        // // message
        // clientConnected.on('message', (entry) => {
        //   clientConnected.to(entry.room).emit('message', entry.data);
        // });

        // clientConnected.on('disconnect', async () => {
        //   clientConnected.emit('leave', {id: clientConnected.id});
        // });