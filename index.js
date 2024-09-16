import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { leerTareas,nuevaTarea,borrarTarea,estadoTarea,textoTarea } from "./db.js";

const server = express();



/* ------------------------------------------------------ */



server.use(cors());
server.use(express.json());




server.get("/tareas", async (peticion,respuesta) => {
    try{
        let tareas = await leerTareas();
        respuesta.json(tareas);

    }catch(error){
        respuesta.status(500);
        respuesta.send({ error : "leer req error"});
    }
});



server.post("/tareas/nueva", async (peticion,respuesta, next) => {
    let {tarea} = peticion.body;

    if( tarea && tarea.trim() != ""){
        try{
            let id = await nuevaTarea(peticion.body.tarea);
            
            respuesta.json({id});

        }catch(error){
            respuesta.status(500);
            return respuesta.json({ error : "add req error" });
        }
    };

    next({ error : "tarea en blanco" });
});



server.delete("/tareas/borrar", async (peticion,respuesta) => {
    try{
        let cantidad = await borrarTarea(peticion.body.id);
        console.log("borrar : " + peticion.body.id);
        respuesta.json({ resultado : cantidad ? "ok" : "ko" });

    }catch(error){
        respuesta.status(500);
        respuesta.send({ error : "del req error" });
    }
});



server.put("/tareas/actualizar/estado", async (peticion,respuesta) => {
    try{
        let cantidad = await estadoTarea(peticion.body.id);
        console.log("actualizar estado : " + peticion.body.id);
        respuesta.json({ respuesta : cantidad ? "ok" : "ko" });

    }catch(error){
        respuesta.status(500);
        respuesta.send({ error : "update status error" });
    }
});



server.put("/tareas/actualizar/texto", async (peticion,respuesta) => {
    try{
        let {tarea} = peticion.body;
        let cantidad = await textoTarea(peticion.body.id);
        console.log("actualizar " + tarea + " id : " + peticion.body.id);
        respuesta.json({ respuesta : cantidad ? "ok" : "ko" });

    }catch(error){
        respuesta.status(500);
        respuesta.send({ error : "update text error" });
    }
})



/*
server.put("/tareas/actualizar/:accion(1|2)/:id", async (peticion,respuesta) => {
    let acciones = [estadoTarea,textoTarea];
    let {id,accion} = peticion.params;
    let {tarea} = peticion.body;
    accion = Number(operacion);

    if( accion == 2 && ( !tarea || tarea.trim() == "" ) ){
        return next({ error : "tarea en blanco "});
    }

    try{
        let cantidad = await acciones[accion -1](id,accion == 1 ? tarea : null);

        respuesta.json({ resultado : cantidad ? "ok" : "ko" });

    }catch(error){
        respuesta.status(500);
        return respuesta.json({ error : "error en el servidor" });
    }
});
*/



/* ------------------------------------------------------ */


server.listen(process.env.PORT);