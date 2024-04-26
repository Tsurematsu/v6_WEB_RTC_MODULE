
    // const iceServers = await ReadJSON("/cli/iceServers.json");
    // const peerClient = new RTCPeerConnection({iceServers});
    // const chat = peerClient.createDataChannel('chat');
    // chat.addEventListener('open', () => {
    //     log.chatPeer("connection establecida!!");
    // });

    // const io = (await import("./socket.io.esm.min.js")).default;
    


// socket.on("connect", () => {
    //     countConnected++; if (countConnected>=2) {location.reload();}
    //     log.system("connect", socket.id);
    //     socket.on("join", (entry) => {
    //         peerClient.onicecandidate = (event) => {
    //             if (event.candidate) {
    //                 log.candidates("Enviando candidato");
    //                 socket.emit("candidate", {room, data:event.candidate}); 
    //             }
    //         };
    //         peerClient.createOffer().then((offer) => {
    //             socket.on("answer", (answer) => {
    //                 log.system("Recibiendo answer");
    //                 peerClient.setRemoteDescription(new RTCSessionDescription(answer));
    //             });

    //             peerClient.setLocalDescription(offer);
    //             log.system("Enviando offer");
    //             socket.emit("offer", {room, data:offer});
    //         });
    //     });
    //     socket.emit("join", {room});
    //     socket.on("offer", async (entry) => {
    //         peerClient.setRemoteDescription(new RTCSessionDescription(entry))
    //         peerClient.createAnswer().then((answer) => {
    //             log.system("answer creado");
    //             peerClient.setLocalDescription(answer);
    //             log.system("Enviando answer");
    //             socket.emit("answer", {room, data:answer});
    //         });
    //     });
    //     socket.on("candidate", (entry) => {
    //         log.candidates("Recibiendo candidato");
    //         peerClient.addIceCandidate(new RTCIceCandidate(entry));
    //     });
    // });



    return;
    // const peerClient = new RTCPeerConnection({iceServers});
    // RTC_CHAT(peerClient);
    
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