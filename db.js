import {MongoClient,ObjectId} from "mongodb";
import dotenv from "dotenv";
dotenv.config();

function conectar(){
    return MongoClient.connect(process.env.MONGO_URL);
}



/* -------------------------------------------- */

export function leerTareas(){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = await conectar();
            const coleccion = conexion.db("tareas").collection("tareas");

            let tareas = await coleccion.find({}).toArray();

            conexion.close();

            //ok(tareas);
            ok(tareas.map(({_id,tarea,estado}) => {
                let id = _id;
                return({id,tarea,estado});
            }));

        }catch(error){
            ko({error : "error leer db"});
        }
    })
}


export function nuevaTarea(tarea){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = await conectar();
            const coleccion = conexion.db("tareas").collection("tareas");

            let {insertedId} = await coleccion.insertOne({tarea : tarea, estado : false});
            
            conexion.close();

            ok(insertedId);

        }catch(error){
            ko({ error : "error crear db"});
        }
    })
}


export function borrarTarea(id){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = await conectar();
            const coleccion = conexion.db("tareas").collection("tareas");

            let {deletedCount} = await coleccion.deleteOne({ _id : new ObjectId(id)});

            conexion.close();

            ok(deletedCount);

        }catch(error){
            ko({ error : "error borrar db"})
        }
    })
}


export function estadoTarea(id){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = await conectar();
            const coleccion = conexion.db("tareas").collection("tareas");

            let {estado} = await coleccion.findOne({ _id : new ObjectId(id) });

            let {modifiedCount} = await coleccion.updateOne({ _id : new ObjectId(id)}, { $set : { estado : !!estado }});

            conexion.close();

            ok(modifiedCount);

            //console.log(estado);

        }catch(error){
            ko({ error : "error estado db" })
        }
    })
}


export function textoTarea({id,tarea}){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = await conectar();
            const coleccion = conexion.db("tareas").collection("tareas");

            let {modifiedCount} = await coleccion.updateOne({ _id : new ObjectId(id)}, { $set : { tarea : tarea}});

            conexion.close();

            ok(modifiedCount);

        }catch(error){
            ko({ error : "error texto db" });
        }
    })
}

/*
nuevaTarea("proyecto 3")
.then( x => console.log(x))
.catch( x => console.log(x));
*/

/*
borrarTarea("66e0368c52ddb1541fdcfb6e")
.then( x => console.log(x))
.catch( x => console.log(x));
*/

/*
estadoTarea("66e01b3c394526215bc92319")
.then( x => console.log(x))
.catch( x => console.log(x));
*/


/*
textoTarea({ id : "66e01b3c394526215bc92319", tarea : "proyecto 1"})
.then( x => console.log(x))
.catch( x => console.log(x));
*/

/*
leerTareas()
.then(x => console.log(x))
.catch(x => console.log(x));
*/