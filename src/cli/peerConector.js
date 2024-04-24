import socket from "./socket.js";
import { ReadJSON, log, showAlert } from "./toolkit.js";
// log.hidden = ["system", "peer", "chatPeer"];
// log.hidden = ["test"]

export default async function peerConector({
    url="/", 
    newMember=()=>{}, 
    name="Juan", 
    room="room1"
}){
    const params = {url, newMember, name, room};
    let Socket = await socket(params);
    log.system("Socket connected, your ID:", Socket.id);
    await showAlert(`Socket connected, your ID: ${Socket.id}`);
    
    Socket.events.joiNotMe(async (data) => {
        Socket.emit.offer(data.id, {data: "Hola soy el cliente 1"});
    });

    Socket.events.offer(async (data) => {
        log.test("OFFER MEMBER: ", data);
        
    });

  
}



// Saved code
// Socket.MembersIdNotMe()



    // let peerClient;
    // if (!log.test("Iniciando")) {
    //     peerClient = new RTCPeerConnection({ iceServers: await ReadJSON("/cli/iceServers.json") },);
    //     RTC_CHAT(peerClient);
    // }

// let sendChat = ()=>"";
// let sendChat1 = ()=>"";
// async function RTC_CHAT(peerClient){
//     const chat = peerClient.createDataChannel('chat');
//     chat.addEventListener('open', () => {
//         log.chatPeer("Chat open");
//         sendChat = (msg) => chat.send(msg);
//     });
//     const chat1 = peerClient.createDataChannel('canal1');
//     chat1.addEventListener('open', () => {
//         log.chatPeer("Chat 1 open");
//         sendChat1 = (msg) => chat1.send(msg);
//     });
//     peerClient.addEventListener('datachannel', (event) => {
//         const canal = event.channel;
//         if (canal.label == 'chat') {
//             log.chatPeer("Chat message:", canal);     
//         }
//         if (canal.label == 'canal1') {
//             log.chatPeer("Chat 1 message:", canal);
//         }
//     });
// }





// saved Code


            // log.peer("New member:", data);
            // await showAlert(`Un nuevo miembro`);
            // peerClient.onicecandidate = (event) => {
            //     if (event.candidate) { 
            //         log.peer("Send candidate to:", data.id);
            //         Socket.sendMessage('candidates', {client:data.id, data: event.candidate});
            //      }
            // };
            // const offer = await peerClient.createOffer();
            // peerClient.setLocalDescription(offer);
            // log.peer("Send offer to:", data.id);
            // Socket.sendMessage('offer', {client:data.id, data:offer});

  // Socket.events.offer(async (data) => {
    //     if (log.test("OFFER MEMBER: ", data)) {
    //         Socket.emit.answer(data.id, {data: "Hola soy el cliente 2"});
    //     }else{
    //         // await showAlert(`Oferta del miembro`);
    //         // log.peer("Receive offer from:", data.id);
    //         // await peerClient.setRemoteDescription(new RTCSessionDescription(data.msg))
    //         // const answer = await peerClient.createAnswer();
    //         // peerClient.setLocalDescription(answer);
    //         // Socket.sendMessage('answer', {client:data.id, data:answer});
    //     }
    // });

    // Socket.events.answer(async (data) => {
    //     if (!log.test("ANSWER MEMBER: ", data)) {
    //         log.peer("Receive answer from:", data.id);
    //         await showAlert(`Respuesta del miembro`);
    //         await peerClient.setRemoteDescription(new RTCSessionDescription(data.msg))
    //     }
    // });
    
    // Socket.events.candidate((data) => {
    //     log.candidates("Add candidate:", data.msg);
    //     peerClient.addIceCandidate(new RTCIceCandidate(data.msg));
    // });
    