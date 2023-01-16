import { listRandom } from "../utils/random.js";

process.send("listo");

process.on("message", (parentMsj)=>{
    if(parentMsj!=="iniciar"){
        const resultadoRandom = listRandom(parentMsj)
        process.send(resultadoRandom);
        process.exit()
    }
})