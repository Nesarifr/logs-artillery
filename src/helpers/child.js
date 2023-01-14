import { listRandom } from "../utils/random.js";

process.send("listo");

process.on("message", (parentMsj)=>{
    if(parentMsj!=="iniciar"){
        console.log(parentMsj, "en el child");
        const resultadoRandom = listRandom(parentMsj)
        process.send(resultadoRandom);
    }
})