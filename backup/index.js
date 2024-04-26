import Socket from './Socket.js';
const video1 = document.getElementsByTagName('video')[0];
const video2 = document.getElementsByTagName('video')[1];
const input = document.getElementsByTagName('textarea')[0];
const button = document.getElementsByTagName('button')[0];
async function getWebcamVideo() {
    let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    video1.srcObject = stream;
    video1.muted = true;
    video1.play();
    return stream;
}

let stream
// async function testStream(){
//     stream = await getWebcamVideo();

// }
// testStream();
// button.addEventListener('click', async () => {
//     stream.getTracks().forEach(track => track.stop());
//     // stream.getTracks().forEach(track => track.enabled = false);
// });

async function main() {
    stream = await getWebcamVideo();
    let MySocket = new Socket();
    let RoleInit = false;
    await MySocket.init("/");
    MySocket.effect((members, type)=>{
        let CounterMembers = members.length;
        if (CounterMembers == 0) {RoleInit = true;}
        if(CounterMembers == 1 && !RoleInit){
            let SelectMember = members[CounterMembers-1];
            FunctionSecondClient(members, MySocket.socket, SelectMember);
        }
        if (RoleInit && CounterMembers == 1) {
            RoleInit = false;
            let SelectMember = members[CounterMembers-1];
            FunctionInitClient(members, MySocket.socket, SelectMember);
        }
    });
    await MySocket.join("room1");
    MySocket.socket.on('message', (data) => {
        console.log("---->", data);
    });
}
main();




const webRTC = new RTCPeerConnection(
        { iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302'},
            { urls: 'stun:stun.voipstunt.com' },
            { urls: 'stun:stun.ideasip.com' },
            {
                urls: [ "turn:13.250.13.83:3478?transport=udp" ],
                username: "YzYNCouZM1mhqhmseWk6",
                credential: "YzYNCouZM1mhqhmseWk6"
            }
        ] },
    );

// const webRTC = new RTCPeerConnection(
//         { iceServers: [
//             { 
//                 urls: ['turn:localhost:3478'],
//                 username: 'master',
//                 credential: '1234' 
//             },
//         ] },
//     );


async function FunctionInitClient(members, socket, SelectMember) {
    console.log("Init Client ->", socket.id);

    // evento
    webRTC.onicecandidate = (event) => {
        if (event.candidate) {
            socket.send({client:SelectMember, event:'candidates', data: event.candidate})
        }
    };

    socket.on('candidates', (data) => {
        webRTC.addIceCandidate(new RTCIceCandidate(data.msg));
    });

    RTC_Video();
    webRTC.createOffer().then((offer) => {
        webRTC.setLocalDescription(offer);
        socket.send({client:SelectMember, event:'sdp_offer', data: offer});
        socket.on('sdp_answer', (data) => {
            webRTC.setRemoteDescription(new RTCSessionDescription(data.msg));
        });
    });
}  



function FunctionSecondClient(members, socket, SelectMember) {
    console.log("Second Client ->", socket.id);

    webRTC.onicecandidate = (event) => {
        if (event.candidate) {
            socket.send({client:SelectMember, event:'candidates', data: event.candidate})
        }
    };

    socket.on('candidates', (data) => {
        webRTC.addIceCandidate(new RTCIceCandidate(data.msg));
    });
    
    socket.on('sdp_offer', async (data) => {
        RTC_Video();
        await webRTC.setRemoteDescription(new RTCSessionDescription(data.msg))
        webRTC.createAnswer().then((answer) => {
            webRTC.setLocalDescription(answer);
            socket.send({client:SelectMember, event:'sdp_answer', data: answer});
        });
    });
}


function RTC(){
    let chat = webRTC.createDataChannel('chat');
    chat.addEventListener('open', () => {
        button.addEventListener('click', async () => {
            console.log("---> send message canal [chat]");
            chat.send(input.value);
            window.location.hash = '#nuevaSeccion';
        });
    });

    let canal1 = webRTC.createDataChannel('canal1');
    canal1.addEventListener('open', () => {
        button.addEventListener('click', async () => {
            console.log("---> send message canal [canal1]");
            canal1.send(input.value);
        });
    });

    webRTC.addEventListener('datachannel', (event) => {
        const canal = event.channel;
        if (canal.label == 'chat') {
            canal.addEventListener('message', (event) => {
                console.log('Mensaje recibido canal [chat]:', event.data);
            });        
        }
        if (canal.label == 'canal1') {
            canal.addEventListener('message', (event) => {
                console.log('Mensaje recibido canal [canal1]:', event.data);
            });        
        }
    });
}
RTC();

// Crea una nueva conexión RTC
async function RTC_Video() {
    let videoTrack = stream.getVideoTracks()[0];
    // Añade el stream de video a la conexión RTC
    webRTC.addTrack(videoTrack, stream);

    // Configura un evento para escuchar cuando se añade una nueva pista al stream de la conexión RTC
    webRTC.addEventListener('track', (event) => {
        console.log("Respuesta de la llamada");
        // Obtén el stream remoto
        const remoteStream = event.streams[0];
        // Reproduce el stream remoto en un elemento de video
        video2.srcObject = remoteStream;
        video2.play();
    });
}

// Llama a la función para iniciar el proceso
// RTC_Video();