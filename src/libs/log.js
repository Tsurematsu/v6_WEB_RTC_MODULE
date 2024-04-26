

const config = [];


const log = new Proxy({
    hidden:[...config],
    list:{},
    all:false,
    focus:[],
    focused:[]
},{
    get:(obj, props)=>{
        obj.list[props] = "";
        if (props == "get") {setTimeout(()=>{console.warn(Object.keys(obj.list)); return Object.keys(obj.list)}, 100);}                
        if (obj.hidden.includes(props) || obj.all) {
            return ()=>{return false};
        }

        return (...args)=>{
            console.log(`[${props}]>`, ...args); 
            return true
        };
    },
    set:(obj, props, value)=>{
        if (props == "focus") { obj.focus = value;}
        if (props == "hidden") { obj.hidden.push(...value);}
        if (props == "all") { obj.all = value; }
        return true;
    }
})
export default log;