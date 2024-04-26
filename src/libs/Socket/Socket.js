// log.hidden = ["socket_io", "socket_join"]
import { Server } from "socket.io";
import log from "../log.js";
log.hidden=[
  "socket_message",
  // "browser_1",
  // "browser_2",
  // "browser_3"
]


export default function Socket(server) {
  const io = new Server(server);
  const ClientCache = {};
  io.on("connection", (socket) => {
    ClientCache[socket.id]=ClientCache[socket.id]??{};
    socket.on("join", async (room, ...args) => {
      ClientCache[socket.id].room=ClientCache[socket.id].room??room;
      await socket.join(room);
      log.joinClient(room, socket.id);
      io.to(room).emit("join", String(socket.id));
    });

    socket.on("message", async (event=null, data=null, addressee=null) => {
      ClientCache[socket.id]=ClientCache[socket.id]??{};
      ClientCache[socket.id].data=ClientCache[socket.id].data??data;
      log.socket_message("message =>", {
        event, 
        data, 
        addressee,
        ClientCache:ClientCache[socket.id]
      });
      const roomClient = ClientCache[socket.id].room; 
      const EmtSocket = roomClient?
            socket.to(roomClient):
            socket.broadcast;
            
      EmtSocket.emit(
        event??"message", 
        data??[], 
        socket.id, 
        addressee
      );
    });

  });
  return io;
}