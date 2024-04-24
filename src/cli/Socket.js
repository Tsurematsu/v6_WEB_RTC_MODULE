export default async function socket
({
    url="/", 
    newMember=()=>{}, 
    name="Juan", 
    room="room1"
}) {
    let members = [];
    const io = (await import("./socket.io.esm.min.js")).default;
    const socket = await io(url);
    const MembersIdNotMe = () => members.filter((member) => member !== socket.id);
    const PromiseToEvent = async (event, callback) => await new Promise((resolve, _) => { 
            socket.on(event, (data=null) => { 
                callback(data); 
                resolve(data); 
            }); 
        });
    const eventSocket = async (event, callback) => await PromiseToEvent(event, callback);
    const emitMessage = (event, data, client=null) => {
        const cloneObject = {...data};
        if (client!==null) {cloneObject.client = client;}
        socket.emit(event, cloneObject);
    };
    const sendMessage = (event=null, data, client=null) => {
        if (client!==null) {data.client = client;}
        if (event===null) {event = 'message';}
        if (event!==null) {data.event = event;}
        socket.send(data);
    };
    //--------------------------- Eventos base de connector -------------------------
    const events = {
        join: async (callback=()=>{}) => await eventSocket('join', callback),
        joiNotMe: async (callback=()=>{}) => await eventSocket('join', (data) => {
            if (data.id !== socket.id) {callback(data);}
        }),
        leave: async (callback=()=>{}) => await eventSocket('leave', callback),
        connect: async (callback=()=>{}) => await eventSocket('connect', callback),
        //---------------------------- Eventos de ofertas y respuestas -------------------
        offer: async (callback=()=>{}) => await eventSocket('offer', callback),
        answer: async (callback=()=>{}) => await eventSocket('answer', callback),
        //---------------------------- Eventos de candidatos -----------------------------
        candidate: async (callback=()=>{}) => await eventSocket('candidate', callback),
    }
    const send = {
        offer: (client=null, data) => sendMessage('offer', client, data),
        answer: (client=null, data) => sendMessage('answer', client, data),
        candidate: (client=null, data) => sendMessage('candidate', client, data),
    }
    const emit = {
        offer: (client=null, data) => emitMessage('offer', client, data),
        answer: (client=null, data) => emitMessage('answer', client, data),
        candidate: (client=null, data) => emitMessage('candidate', client, data),
    }
    await events.connect();
    events.join((data) => {
        members = data.members;
        newMember(members);
    });
    emitMessage('join', {room});
    return {
        events, 
        emitMessage, 
        sendMessage, 
        socket,
        id: socket.id, 
        MembersIdNotMe,
        send,
        emit,
    };
}