export default function EditFrases({id,nombre,edit,borrar}){
    return(
        <div>
            <p>USUARIO:{nombre}</p>
            <button onClick={edit}>Editar</button>
            <button onClick={borrar}>Borrar</button>
        </div>
    )
}