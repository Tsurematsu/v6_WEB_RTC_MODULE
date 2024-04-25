import { log } from "./toolkit.js";

export default peerConector;

async function peerConector({ url = "/", name = "Juan", room = "room1" }) {
  url = String(url);
  name = String(name);
  room = String(room);
  const socket = io(url);
  log.hidden = [
    "system", 
    "system_connect", 
    "system_join", 
    // "system_message", 
    // "system_message_1"
  ]
  socket.on("connect", () => {
    log.system_connect("colección establecida");
    socket.emit("join", "cuarto1");
  });

  socket.on("join", (sender) => {
    if (socket.id==sender) {
      log.system("My ID =>", socket.id);  
    }else {
      log.system_join("client joined =>", sender);
      // socket.send({addressee:sender, data:"Hello"});
      socket.send("it's working", "msg", sender);
      // socket.send("Hello");
    }
  });

  socket.on("message", (data) => {
    log.system_message("message =>", data);
  });
  socket.on("msg", (data) => {
    log.system_message_1("mgs =>", data);
  });

}
