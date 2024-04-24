// return {events, emitMessage, sendMessage, socket};
import peerConector from "/cli/peerConector.js";
// import socket from "../../src/cli/Socket";
async function Main(){
   peerConector({room:"room1"});
}
Main();




















function RandomNames() {
    const names = [
        "Jorge", "Juan", "Pedro", "Maria",
        "Jose", "Ana", "Luis", "Carlos",
        "Rosa", "Laura", "Sofia", "Fernando",
        "Ricardo", "Roberto", "Raul", "Ramon",
    ]
    return names[Math.floor(Math.random() * names.length)]
}