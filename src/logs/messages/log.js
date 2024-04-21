export default new class{
    server(msg){
        MSG_LOG(`SERVER => ${msg}`);
    }
    stunServer(msg){
        MSG_LOG(`SERVER STUN => ${msg}`);
    }
    react(msg){
        MSG_LOG(`REACT => ${msg}`);
    }
    discreet(msg){
        MSG_LOG(`DISCREET => ${msg}`);
    }
}

function MSG_LOG(msg) {
    console.log(msg);
}