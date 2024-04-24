async function ReadJSON(URL) {
    const response = await fetch(URL);
    if (!response.ok) {throw new Error(`HTTP error! status: ${response.status}`);}
    return await response.json();
}

function showAlert(message) {
    return new Promise(resolve => {
      setTimeout(() => {
        alert(message);
        resolve();
      }, 0);
    });
  }

const log = new Proxy({
    hidden:[],
    all:false,
},{
    get:(obj, props)=>{
        if (obj.hidden.includes(props) || obj.all) {
            return ()=>{return false};
        }
        return (...args)=>{
            console.log(`[${props}]=> `, ...args); 
            return true
        };
    },
    set:(obj, props, value)=>{
        if (props == "hidden") { obj.hidden.push(...value);}
        if (props == "all") { obj.all = value; }
        return true;
    }
})


export {ReadJSON, showAlert, log}