"use client"
export default function EditFrases(nombre){
    const edit = () =>{

    }
    const borrar = () => {
        
    }
    return(
        <div>
            <p>{nombre}</p>
            <button onClick={edit}>Editar</button>
            <button onClick={borrar}>Borrar</button>
        </div>
    )
}