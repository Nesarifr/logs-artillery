import Express  from "express";
import { ContenedorArchivo } from "../managers/ContenedorArchivo.js";
import { logger } from "../utils/logger.js";


/* ------------------------ configuracion del routerProducts ------------------------ */
export const routerProducts = Express.Router();
export const products = new ContenedorArchivo('products')

routerProducts.use(Express.json());
routerProducts.use(Express.urlencoded({extended: true}))


/* ------------------------------ GET: '/:id?' ------------------------------ */
// Me permite listar todos los productos disponibles ó un producto por su id 
/* -------------- (disponible para usuarios y administradores) -------------- */


routerProducts.get('/:id', async (req, res)=>{
    try{
        logger.info("Se busca el producto por ID")
        const {id} = req.params
        const existeProducto = await products.getById(id)
        if(existeProducto.length){
            res.json(await products.getById(parseInt(id)))
        } else return res.json({error: 'No existe el archivo solicitado'})
    }
    catch(error){
        logger.error("error en productos get id "+ error)
        res.status(500).send('Error en el servidor')
    }
})

/* -------------------------------- POST: '/' ------------------------------- */
/* ------------------ Para incorporar productos al listado ------------------ */
/* -------------------- (disponible para administradores) ------------------- */

const esAdmin = (req, res, next) =>{
    if(req.headers.authorization != "true"){
        return res.json({ error : '-1', descripcion: `ruta ${req.headers.referer} método ${req.method} no autorizada`})
    }    
    else{next()}
}

routerProducts.post('/', esAdmin, async (req, res)=> {
    try{
        logger.info("Se crea nuevo producto con POST / con verificacion de administrador")
        const loadProduct = req.body
        const nuevoId = await products.save(loadProduct)
        res.json({
            id: nuevoId,
            nuevoProducto: loadProduct
        })
    }catch(error){
        logger.error("productos POST "+ error)
        res.status(500).send('Error en el servidor')
    }    
})

/* ------------------------------- PUT: '/:id' ------------------------------ */
/* --------------------- Actualiza un producto por su id -------------------- */
/* -------------------- (disponible para administradores) ------------------- */


routerProducts.put('/:id', esAdmin, async (req, res)=>{
    try{
        logger.info("se modifica el producto con PUT /:id con verificacion de  Admin")
        const {id} = req.params
        const upDate = req.body
        const actualizacion = await products.actualizaByID(parseInt(id), upDate)
        if(actualizacion){
            res.json(actualizacion)
        } else res.json({error: "No se pudo actualizar el producto solicitado"})
    }
    catch{
        logger.error("productos PUT id ")
        res.status(500).send('Error en el servidor')
    }
})

/* ----------------------------- DELETE: '/:id' ----------------------------- */
/* ----------------------- Borra un producto por su id ---------------------- */
/* -------------------- (disponible para administradores) ------------------- */


routerProducts.delete('/:id', esAdmin, async (req, res)=>{
    try{
        
        logger.info("se realiza un DELETE /:id con verificacion de admin");
        const {id} = req.params
        const productoID=await products.getById(id)
        if(productoID.length){ //getById devuelve null en caso de que no exita el elemento con ID
            await products.deletedById(parseInt(id))
            res.json({error: "Producto eliminado"})
        } else {res.json({error: "El producto no existe"})}
    }
    catch{
        logger.error("productos delete id")
        res.status(500).send('Error en el servidor')
    }
    
})

export default {routerProducts, products}