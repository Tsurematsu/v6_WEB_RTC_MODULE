import { Server } from "socket.io";
export default function Socket(server) {
    const socket = new Server(server);
    const rooms = {};
    const rooms_socket = {};

    const Members = (room) => Object.keys(rooms).filter((id) => rooms[id].room == room);
    const RoomClient = (id) => rooms[id].room;
    socket.on('connection', (clientConnected) => {
        clientConnected.on('join', (data) => {
          const room = String(data.room??data);
          clientConnected.join(room);
          rooms[clientConnected.id] = { id: clientConnected.id, room};
          rooms_socket[clientConnected.id] = clientConnected;
          socket.to(room).emit('join', {id: clientConnected.id, members: Members(room)});
        });

        clientConnected.on('candidate', (msg) => {
          rooms_socket[msg.client].emit('candidate', {msg: msg.data, id: clientConnected.id});
        });
        clientConnected.on('offer', (msg) => {
          rooms_socket[msg.client].emit('offer', {msg: msg.data, id: clientConnected.id});
        });
        clientConnected.on('answer', (msg) => {
          rooms_socket[msg.client].emit('answer', {msg: msg.data, id: clientConnected.id});
        });

        clientConnected.on('message', (msg) => {
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