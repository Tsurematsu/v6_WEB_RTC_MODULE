import { Server } from "socket.io";
export default function Socket(server) {
    const socket = new Server(server);
    const rooms = {};
    const rooms_socket = {};

    const Members = (room) => Object.keys(rooms).filter((id) => rooms[id].room == room);
    const RoomClient = (id) => rooms[id].room;
    socket.on('connection', (clientConnected) => {
        clientConnected.on('join', (entry) => {
          const room = String(entry.room??entry);
          clientConnected.join(room);
          rooms[clientConnected.id] = { id: clientConnected.id, room};
          rooms_socket[clientConnected.id] = clientConnected;
          socket.to(room).emit('join', {sender: clientConnected.id, members: Members(room)});
        });       

        clientConnected.on('offer', (entry) => {
          if (entry.addresses !== null && rooms_socket[entry.addresses] !== undefined) {
            rooms_socket[entry.addresses].emit('offer', {sender: clientConnected.id, data: entry.data});
          }
        });

        clientConnected.on('answer', (entry) => {
          if (entry.addresses !== null && rooms_socket[entry.addresses] !== undefined) {
            rooms_socket[entry.addresses].emit('answer', {sender: clientConnected.id, data: entry.data});
          }
        });

        clientConnected.on('candidate', (entry) => {
          if (entry.addresses !== null && rooms_socket[entry.addresses] !== undefined) {
            rooms_socket[entry.addresses].emit('candidate', {sender: clientConnected.id, data: entry.data});
          }
        });

        clientConnected.on('disconnect', async () => {
          if (rooms[clientConnected.id] != undefined) {
            let room = RoomClient(clientConnected.id);
            delete rooms[clientConnected.id];
            delete rooms_socket[clientConnected.id];
            socket.emit('leave', {id: clientConnected.id, members:Members(room)});
          }
        });
        
    });

    return socket;
}