// log.hidden = ["socket_io", "socket_join"]
import { Server } from "socket.io";
import log from "../log.js";
export default function Socket(server) {
  let Clientes = [];
  const io = new Server(server);
  const Cache_clients = {};
  
  log.hidden = [
    "socket_io", 
    "socket_join", 
    "socket_message", 
    // "browser_0", 
    // "browser_1"
  ];

  io.on("connection", (socket) => {
    Cache_clients[socket.id] = socket;
    Clientes=Object.keys(Cache_clients);
    
    log.socket_io(`cliente conectado ${socket.id}:${Clientes.length} clientes conectados`);
    
    socket.on("join", async (room) => {
      log.socket_join("joined to => ", room);
      await socket.join(room);
      io.to(room).emit("join", String(socket.id));
      // socket.to(room).emit("join", String(socket.id));
    });

    // Nota: el evento "message" es reservado por socket.io
    socket.on("message", async (data, event=null, addressee=null) => {
      log.socket_message("message =>", data, event, addressee);
      if (event!=null && addressee!=null) {
        Cache_clients[addressee].emit(event, data);
      }else if(event!=null){
        socket.broadcast.emit(event, data);
      }else{
        socket.broadcast.emit("message", data);
      }
    });

    socket.on("disconnect", async () => {
      log.socket_io(`cliente desconectado ${socket.id}:${Clientes.length} clientes conectados`);
      delete Cache_clients[socket.id];
    });
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
