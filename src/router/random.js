import Express  from "express";
import {fork} from "child_process";
import { logger } from "../utils/logger.js";
import { listRandom } from "../utils/random.js";
import cluster from "cluster";


export const routerRandom = Express.Router();

const numeroCPUs = 3 // pruebo con un maximo de 3 cpu




routerRandom.use(Express.json());
routerRandom.use(Express.urlencoded({extended: true}))

routerRandom.get('/', async (req, res)=>{
    try{
        // logger.info("se ingresa al router random sin child_process")
        if(!req.query.cant){
            logger.error("falta definir la cantidad de randoms ?=500000 por ejemplo")
            res.json({error:"falta definicr la cantidad de randoms ?=500000 por ejemplo"})
        } else {
            // logger.info("se devuelve la lista random")
            const resultadoRandom = listRandom(req.query.cant)
            res.json({resultado:resultadoRandom})
        }
    }
    catch(error){
        res.status(500).send('Error en el servidor')
    }
})


routerRandom.get('/child',  (req, res)=>{
    try{
        // logger.info("se ingresa al router random con el child_process ")

        if(cluster.isPrimary){
            // logger.info(" es primary")
            //crear los subproceso del cluster
            if(cluster.workers.length<=numeroCPUs){
                cluster.fork()
            }

            

            const resultadoRandom = listRandom(req.query.cant)
            res.json({resultado:resultadoRandom})
        
            cluster.on("exit",(worker,error)=>{
                //detectamos que algun subproceso falla
                console.log(`El subproceso ${worker.process.pid} dejo de funcionar`);
                cluster.fork();//creamos un nuevo subproceso que remplaza al que fallo
            });
        
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
