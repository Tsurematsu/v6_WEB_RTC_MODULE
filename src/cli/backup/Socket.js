export default class Socket {
    #FilterMe = (data)=>data.filter(a => a !== this.socket.id);
    #effectMember=()=>{};
    members = [];
    constructor(){}
    async init(url) {
        const io = (await import("./socket.io.esm.min.js")).default;
        //const io = (await import("https://cdn.socket.io/4.7.5/socket.io.esm.min.js")).default;
        this.socket = await io(url);
        await new Promise((resolve, _) => {
            this.socket.on("connect", () => {
                this.id = this.socket.id;
                resolve();
            });
            this.socket.on('leave', (data) => {
                this.members = this.#FilterMe(data.members);
                this.#effectMember(this.members, "leave");
            });
        });
                     
    }

    async join(room){
        this.room = room;
        this.socket.emit('join', room);
        await new Promise((resolve, _) => {
            this.socket.on('join', (data) => {
                this.members = this.#FilterMe(data.members);
                this.#effectMember(this.members, "join");
                resolve(data);
            });
        });
        
    }

    effect (callback){
        this.#effectMember = callback;
    }

    on = {
        join: async (callback=()=>{}) => {
            await new Promise((resolve, _) => {
                this.socket.on('join', (data) => {
                    this.members = this.#FilterMe(data.members);
                    callback(this.members);
                    this.#effectMember(this.members, "join");
                    resolve(data);
                });
            });
        },
        leave: async (callback=()=>{}) => {
            await new Promise((resolve, _) => {
                this.socket.on('leave', (data) => {
                    this.members = this.#FilterMe(data.members);
                    callback(this.members);
                    this.#effectMember(this.members, "leave");
                    resolve(data);
                });
            });
        },
        event : async (event, callback=()=>{}) => {
            await new Promise((resolve, _) => {
                this.socket.on(event, (data) => {
                    callback(data);
                    resolve(data);
                });
            });
        }
    }    
}
