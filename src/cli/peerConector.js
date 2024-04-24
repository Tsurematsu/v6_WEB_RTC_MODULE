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
    url = String(url);
    name = String(name);
    room = String(room);
    
    let Socket = await socket({url, newMember, name, room});
    
    const iceServers = await ReadJSON("/cli/iceServers.json");
    const peerClient = new RTCPeerConnection({iceServers});
    RTC_CHAT(peerClient);
    
    
    Socket.Events.join(async (entry, retorno, sender)=>{
        log.id("My id:", Socket.id);
        peerClient.createOffer().then((offer) => {
            peerClient.setLocalDescription(offer);
            peerClient.onicecandidate = (event) => {
                if (event.candidate) {
                    log.candidates("Enviando candidato a", sender);
                    Socket.Emit("candidate", event.candidate, sender); 
                }
            };
            
            // Socket.Emit("offer", offer, sender);
            retorno("offer", offer);
        });
    })

    Socket.Events.offer(async (entry, retorno, sender)=>{
        await peerClient.setRemoteDescription(new RTCSessionDescription(entry))
        const answer = await peerClient.createAnswer();
        peerClient.setLocalDescription(answer);
        retorno("answer", answer);
    })
    
    Socket.Events.answer(async (entry, _, sender)=>{
        await peerClient.setRemoteDescription(new RTCSessionDescription(entry))
    })

    Socket.Events.candidate((entry, _, sender)=>{
        log.candidates("Recibiendo candidato de", sender);
        peerClient.addIceCandidate(new RTCIceCandidate(entry));
    })
    
   
    
    
}





let sendChat = ()=>"";
let sendChat1 = ()=>"";
async function RTC_CHAT(peerClient){
    const chat = peerClient.createDataChannel('chat');
    chat.addEventListener('open', () => {
        log.chatPeer("Chat open");
        sendChat = (msg) => chat.send(msg);
    });
    const chat1 = peerClient.createDataChannel('canal1');
    chat1.addEventListener('open', () => {
        log.chatPeer("Chat 1 open");
        sendChat1 = (msg) => chat1.send(msg);
    });
    peerClient.addEventListener('datachannel', (event) => {
        const canal = event.channel;
        if (canal.label == 'chat') {
            log.chatPeer("Chat message:", canal);     
        }
        if (canal.label == 'canal1') {
            log.chatPeer("Chat 1 message:", canal);
        }
    });
}





// saved Code


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
    