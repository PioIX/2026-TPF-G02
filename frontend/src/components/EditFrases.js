import Button from "./Button"
import styles from "./EditFrases.module.css"
export default function EditFrases({frase,edit,borrar}){
    return(
        <div className={styles.fila}>
            <p className={styles.texto}>{frase}</p>
            <Button txt="Editar" onClick={edit} />
            <Button txt="Borrar" tipo="rojo" onClick={borrar} />
        </div>
    )
}