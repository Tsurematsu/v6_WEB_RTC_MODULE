import { ReadJSON, log, showAlert } from "./toolkit.js";

export default peerConector;

async function peerConector({ url="/", name="Juan", room="room1"}){
    url = String(url); name = String(name); room = String(room);
    const socket = io(url);
    let countConnect = 0;
    socket.on("connect", (data)=>{
        log.system("colección establecida");
        // countConnect++; if (countConnect>=2) {location.reload();}
        // socket.emit("join", "cuarto1")
    })
}












