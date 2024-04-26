// return {events, emitMessage, sendMessage, socket};
import peerConector from "/cli/peerConector.js";
// import socket from "../../src/cli/Socket";
async function Main(){
   peerConector({room:"room1"});
}
Main();