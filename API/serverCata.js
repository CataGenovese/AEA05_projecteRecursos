import express from "express";
import bodyParser from "body-parser";

import recursoRoutes from "./routes/recursoRoutes.js";
import usuarisRoutes from "./routes/usuarisRoutes.js";
import reserveRoutes from "./routes/reserveRoutes.js"; 
import notificacionsRoutes from "./routes/notificacionsRoutes.js";

import { PORT, SECRET_JWT_KEY } from "./config.js";
import { UserRepository } from './user-repository.js';
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';


const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static("public"));

//inicio middleware
app.use((req,res,next)=>{
    //leemos el token desde las cookies
    const token =req.cookies.access_token
    req.session={user: null}
    try{
        //Intenta verificar el token con la clave secreta.
        const data=jwt.verify(token,SECRET_JWT_KEY)
        //Si es válido, guarda la info del usuario en req.session.user.
        req.session.user=data
    }catch(error){
        //Si falla, el user es null
        req.session.user=null
    }
    next() // seguir a la siguiente ruta o middleware.
})

app.set("view engine", "ejs");
app.set("views", "./views"); 

// Rutas para recursos y usuarios
app.use("/recursos", recursoRoutes);
app.use("/usuaris", usuarisRoutes);
app.use("/notificacions", notificacionsRoutes);
app.use("/reserves", reserveRoutes);

//Muestra la página de login y le pasa los datos del usuario si ya hay uno autenticado
app.get('/',(req, res)=>{
    const {user}= req.session
    res.render('login/index', user)
})

//recibe el usuario y contraseña desde el cliente.
//si son válidos, genera un token y lo guarda en una cookie segura.
//devuelve los datos del usuario y el token.
//si no son válidos, responde con un error 401 (no autorizado).
app.post('/login', async (req,res)=>{
    try{
        const {username,password}=req.body
        console.log("llego aqui")
        const user = await UserRepository.login({username,password})
        console.log("llego aqui 1")
        const token = jwt.sign(
            {id: user._id, username: user.username},
            SECRET_JWT_KEY, 
            {
            expiresIn:'1h'
            })
            console.log("llego aqui 2")
        res
        .cookie('access_token',token,{
            httpOnly:true, //la cookie solo se puede acceder en el servidor, no podrem fer un document.cookie
            //secure:true, //la cookie solo funciona en https
            secure: process.env.NODE_ENV==='production',
            sameSite:'strict', //la cookie es pot accedir dins del domini
            maxAge:1000*60*60 //la cookie te un temps de validesa d'una hora
        })
        .send({ user,token })
    }catch (error){
        //401 = no autorització
        res.status(401).send(error.message)
    }
});


//Registra un nuevo usuario
//devuelve el ID del nuevo usuario si todo va bien
//si ocurre un error (por ejemplo, usuario ya existe), responde con 400
app.post('/register', async (req,res)=>{
    //aqui el body es el cuerpo de la petición
    const {username,password}=req.body
    console.log(req.body)
    try{
        const id= await UserRepository.create({username,password});
        res.send({id})
    }catch(error){
        //No es buena idea mandar el error del repositorio
        res.status(400).send(error.message)
    }
});

//borra la cookie (tanca la sesion) y nos redirige a la pagina de login
app.post('/logout',(req,res)=>{
    res
    .clearCookie('access_token')
    //He cambiado esta parte del código para hacer que el código redirija a la página de login al darle a cerrar sesión en la home
    res.redirect('/');
});

//si el usuario esta logueado muesta la home.ejs
//sino redirige al login
app.get('/protected',(req,res)=>{
    const {user}=req.session
    if (!user) return res.status(403).send('acceso no autorizado')
    res.render('login/protected',user)
});

//Si el usuario esta autenticado va al home. Sino va a /
app.get('/home', (req, res)=>{
    const { user } = req.session;
    if (!user) return res.redirect('/');
    res.render('home', { username: user.username });
});

// Inicia el servidor
app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`);
}); 
