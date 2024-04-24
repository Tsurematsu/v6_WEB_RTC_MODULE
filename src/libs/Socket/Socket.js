import { Server } from "socket.io";
export default function Socket(server) {
    const socket = new Server(server);
    const rooms = {};
    const rooms_socket = {};

    socket.on('connection', (clientConnected) => {
        clientConnected.on('join', (entry) => {
          const room = String(entry.room??entry).trim();
          clientConnected.join(room);
          clientConnected.to(room).emit('join', {sender: clientConnected.id});
        });   
        
        clientConnected.on('offer', (entry) => {
          clientConnected.to(entry.room).emit('offer', entry.data);
        });

        clientConnected.on('answer', (entry) => {
          clientConnected.to(entry.room).emit('answer', entry.data);
        });

        clientConnected.on('candidate', (entry) => {
          clientConnected.to(entry.room).emit('candidate', entry.data);
        });

        clientConnected.on('disconnect', async () => {
          clientConnected.emit('leave', {id: clientConnected.id});
        });
        
    });

    return socket;
}