export default async function socket
({
    url="/", 
    name="Juan", 
    room="room1"
}) {
    url = String(url);
    name = String(name);
    room = String(room);
    const io = (await import("./socket.io.esm.min.js")).default;
    const socket = await io(url);
    const MembersIdNotMe = () => members.filter((member) => member !== socket.id);
    const ToAwaitEvent = (event, callback=(...args)=>args) => new Promise((resolve) => {
        socket.on(event, async (...args) => {
            resolve(await callback(...args));
        });    
    });
    const AdapterEvents = (event, callback) => {
        socket.on(event, (entry)=>{
            let dataCall = entry.data??entry;
            let returnClient = (event, output)=>{
                Emit(event, output, entry.sender);
            };
            callback(dataCall, returnClient, entry.sender);
        });
    }
    const Events = {
        join: (callback)=>AdapterEvents("join", callback),
        offer: (callback)=>AdapterEvents("offer", callback),
        answer: (callback)=>AdapterEvents("answer", callback),
        candidate: (callback)=>AdapterEvents("candidate", callback),
        leave: (callback)=>AdapterEvents("leave", callback),
    }

    const Emit = (event, output, addresses=null)=>{
        let retorno = {data: output};
        if (addresses!==null) {retorno.addresses = String(addresses);}
        socket.emit(event, retorno);
    };
    let ListMembers = [];
    // await ToAwaitEvent("connect");
    ToAwaitEvent("join", async ({sender, members}) => {
        ListMembers = members;
    });
    Emit("join", room);

    return {
        socket,
        Emit,
        Events,
        id: socket.id,
        getMembers:()=>ListMembers,
        MembersIdNotMe
    }

}