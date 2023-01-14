import Express  from "express";
import {fork} from "child_process";
import { logger } from "../utils/logger.js";
import { listRandom } from "../utils/random.js";

export const routerRandom = Express.Router();

routerRandom.use(Express.json());
routerRandom.use(Express.urlencoded({extended: true}))

routerRandom.get('/child', async (req, res)=>{
    try{
        logger.info("se ingresa al router random con el child_process ")
        const child = fork("./src/helpers/child.js");
        child.on("message", (childMsj)=>{
            if (childMsj==="listo"){
                if(!req.query.cant){
                    logger.error("falta definir la cantidad de randoms ?=500000 por ejemplo")
                    res.json({error:"falta definicr la cantidad de randoms ?=500000 por ejemplo"})
                } else {
                    child.send(req.query.cant)
                }
                
            }
            else{
                res.json({resultado:childMsj})
            }
        })
    }
    catch(error){
        res.status(500).send('Error en el servidor')
    }
})

routerRandom.get('/', async (req, res)=>{
    try{
        logger.info("se ingresa al router random sin child_process")
        if(!req.query.cant){
            logger.error("falta definir la cantidad de randoms ?=500000 por ejemplo")
            res.json({error:"falta definicr la cantidad de randoms ?=500000 por ejemplo"})
        } else {
            const resultadoRandom = listRandom(req.query.cant)
            res.json({resultado:resultadoRandom})
        }
    }
    catch(error){
        res.status(500).send('Error en el servidor')
    }
})


export default {routerRandom}
