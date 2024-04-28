import { log, ReadJSON } from "./toolkit.js";
export default peerConector;

const local_Log = console.log


async function peerConector({ url = "/", name = "Juan", room = "room1" }) {
  const iceServers = await ReadJSON("/cli/iceServers.json");
  const peersClients = {}
  url = String(url);
  name = String(name);
  room = String(room);
  
  const socket = io(url);
  socket.on("connect", () => {
    socket.emit("join", "cuarto1");
  });
  
  socket.on("join", (sender) => {
    if (socket.id!==sender) {
      let objectPeer = new peerConnection(iceServers);
      let peerClient = objectPeer.peerClient;
      peerClient.onicecandidate = (event) => {if (event.candidate) {
        socket.send("candidate", event.candidate, sender); 
      }};
      peerClient.createOffer().then((offer) => {
        peerClient.setLocalDescription(offer);
        socket.send("offer", offer, sender);
      });
      peersClients[sender] = objectPeer; 
    }
  });
  
  socket.on("answer", (answer, sender, addressee) => {
    if (addressee==socket.id) {
      let peerClient = peersClients[sender].peerClient;
      peerClient.setRemoteDescription(new RTCSessionDescription(answer));
    }
  });

  socket.on("candidate", (candidate, sender, addressee) => {
    if (addressee==socket.id) {
      let peerClient = peersClients[sender].peerClient; 
      peerClient.addIceCandidate(new RTCIceCandidate(candidate));
    }
  });

  socket.on("offer", (offer, sender, addressee) => {
    if (addressee==socket.id) {
      let objectPeer = new peerConnection(iceServers);
      let peerClient = objectPeer.peerClient;
      peerClient.onicecandidate = (event) => {if (event.candidate) {
        socket.send("candidate", event.candidate, sender); 
      }};
      peerClient.setRemoteDescription(new RTCSessionDescription(offer));
      peerClient.createAnswer().then((answer) => {
        peerClient.setLocalDescription(answer);
        socket.send("answer", answer, sender);
      });
      peersClients[sender] = objectPeer;
    }
  });

}

class peerConnection {
  peerClient;
  chat;
  constructor(iceServers){
    this.peerClient = new RTCPeerConnection({iceServers});
    this.chat = this.peerClient.createDataChannel('chat');
    this.chat.addEventListener('open', () => {
      this.chat.send("Hola k tal");
    });
    this.peerClient.addEventListener('datachannel', (event) => {
      const canal = event.channel;
      canal.addEventListener('message', (input) => {
        local_Log(input.data);
      })
    });
  }
}




//  sheet code :)

// const peerClient = new RTCPeerConnection({iceServers})
// const chat = peerClient.createDataChannel('chat');
// chat.addEventListener('open', () => {
//   chat.send("Hola k tal");
// });
// peerClient.addEventListener('datachannel', (event) => {
//   const canal = event.channel;
//   canal.addEventListener('message', (input) => {
//     local_Log(input.data);
//   })
// });
// const socket = io(url);
// socket.on("connect", () => {
//   socket.emit("join", "cuarto1");
// });