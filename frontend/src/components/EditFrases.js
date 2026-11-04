import styles from "./EditFrases.module.css"
export default function EditFrases({frase,edit,borrar}){
    return(
        <div className={styles.fila}>
            <p className={styles.texto}>{frase}</p>
            <button className={styles.editar} onClick={edit}>Editar</button>
            <button className={styles.borrar} onClick={borrar}>Borrar</button>
        </div>
    )
}