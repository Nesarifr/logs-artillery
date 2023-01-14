import Express  from "express";
import mongoose from "mongoose"; //db usuarios
import {Strategy as LocalStrategy} from "passport-local"; //estrategia para autenticar por correo y password.
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from "passport";
import {UserModel} from "../models/user.js"
import bcrypt from "bcrypt";
import { logger } from "../utils/logger.js";

export const routerLogin = Express.Router();


/* --------------------------- configurar passport -------------------------- */
routerLogin.use(passport.initialize()); //conectamos a passport con express.
routerLogin.use(passport.session());//vinculacion entre passport y las sesiones de nuestros usuarios.

routerLogin.use(Express.json());
routerLogin.use(Express.urlencoded({extended: true}))



/* -------------------------- serializar un usuario ------------------------- */
passport.serializeUser((user,done)=>{
    done(null, user.id)
});

/* ------------------------- deserializar al usuario ------------------------ */
passport.deserializeUser((id,done)=>{
    //validar si el usuario existe en db.
    UserModel.findById(id,(err, userFound)=>{
        return done(err, userFound)
    })
});

/* -------------- crear una funcion para encriptar la contrase; ------------- */
// estaesmiPass => ahjsgduyqwte234296124ahsd-hash
const createHash = (password)=>{
    const hash = bcrypt.hashSync(password,bcrypt.genSaltSync(10));
    return hash;
}
/* -------------- crear una funcion para validar contraseña ------------- */
function isValidPassword(user, password) {
    return bcrypt.compareSync(password, user.password);
}

/* ------------ estrategia de registro utilizando passport local. ----------- */
passport.use("signupStrategy", new LocalStrategy(
    {
        passReqToCallback:true,
        usernameField: "email"
    },
    async (req,email,password,done)=>{
        //logica para registrar al usuario
        //verificar si el usuario exitse en db
        await UserModel.findOne({email},(error,userFound)=>{
            if(error) return done(error,null,{message:"Hubo un error"});
            if(userFound) return done(null,false,{message:"El usuario ya existe"});
            //guardamos el usuario en la db
            const newUser={
                nombre:req.body.username,
                email:email,
                password:createHash(password)
            };
            UserModel.create(newUser,(error,userCreated)=>{
                if(error) return done(error, null, {message:"Hubo un error al registrar el usuario"})
                return done(null,userCreated);
            })
        }).clone().catch(function(err){console.log(err);})
    }
));

passport.use("loginStrategy", new LocalStrategy(  {
    usernameField: "email"
    },
    async (email,password,done)=>{

        //logica para registrar al usuario
        //verificar si el usuario exitse en db
        await UserModel.findOne({email},(error,userFound)=>{

            if(error) return done(error,null,{message:"Hubo un error"});

            if(!userFound) return done(null,false,{message:"No existe el usuario"});
            //guardamos el usuario en la db
            if(!isValidPassword(userFound,password)) return done(null, false,{message:"Contraseña incorrecta"});

            return done(null,userFound); 
        }).clone().catch(function(err){console.log(err);})
    }
));


routerLogin.get('/', async (req, res)=>{
    try {
        logger.info("Se ingresa al loggeo")
        if(req.isAuthenticated()){
            return res.redirect('/')
        } else {
            return res.render('partials/login')
        }
    } catch (error) {
        res.send({error})
    }
})

routerLogin.post('/user', passport.authenticate('loginStrategy', {failureRedirect: '/', failureMessage: true }), 
    async (req, res)=>{
    try {
        logger.info("Se ingresa al loggeo si no esta loggeado")
        if(req.session.messages){
            res.render('error', {error: req.session.messages})
        }
        return res.redirect('/')
    } catch (error) {
        res.send({error})
    }
})


/* --------------------- rutas de autenticacion registro -------------------- */
routerLogin.post("/register",passport.authenticate("signupStrategy",{
    failureRedirect:"/",
    failureMessage: true //req.sessions.messages.
}),(req,res)=>{
    logger.info("Se registrar un nuevo usuario")
    res.redirect("/")
});

routerLogin.get('/register', async (req, res)=>{
    try {
        logger.info("Se obtiene la pagina de registracion")
        const error = req.session.message?req.session.messages[0] : '';
        if(error) res.render('partials/error', {error: error})
        res.render('partials/register')
    } catch (error) {
        res.send({error})
    }
})




routerLogin.get('/logout', async (req, res)=>{
    try{
        logger.info("Se cierra sesion")
        req.logout(err=>{
            if(err) return res.send("hubo un error al cerrar sesion")
            req.session.destroy();
            return res.redirect("/api/login")
        });
    }
    catch(error){
        res.status(500).send('Error en el servidor')
    }
});

export default routerLogin