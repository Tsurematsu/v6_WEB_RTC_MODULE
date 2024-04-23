import { Server } from "socket.io";
export default function Socket(server) {
    const socket = new Server(server);
    const rooms = {};
    const rooms_socket = {};

    socket.on('connection', (client) => {
      
        client.on('join', (room) => {
          if (rooms[client.id] == undefined) {
            client.join(room);
            rooms[client.id] = { id: client.id, room: room};
            rooms_socket[client.id] = client;
            socket.to(room).emit('join', {id: client.id, members: Members(room)});
          }
        });

        client.on('message', (data) => {
          let selectSocket = data.client?rooms_socket[data.client]:client;
          let selectEvent = data.event??'message'; 
          let selectData = data.data??data;
          if (data.room && data.client==undefined) {
            selectSocket = socket.to(data.room).emit(selectEvent, {msg:selectData, id:client.id});
          }else{
            selectSocket.emit(selectEvent, {msg:selectData, id:client.id});
          }
        });
      
        client.on('disconnect', async () => {
          if (rooms[client.id] != undefined) {
            let room = RoomClient(client.id);
            delete rooms[client.id];
            delete rooms_socket[client.id];
            socket.emit('leave', {id: client.id, members:Members(room)});
          }
        });
        
    });

    return socket;
}