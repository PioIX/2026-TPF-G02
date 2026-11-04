import styles from "./UsuariosAdmin.module.css"
export default function UsuariosAdmin({usuario,email,bloqueado,control}){
    function status(){
        if(bloqueado === 0){
            return(
                <>
                    <p className={styles.activo}>Activo</p>
                    <button className={styles.boton} onClick={control}>Bloquear</button>
            </>)
        }else{
            return(
                <>
                <p className={styles.bloqueado}>Bloqueado</p>
                <button className={styles.boton} onClick={control}>Desbloquear</button>
                </>)
        }
    }
    return(
        <div className={styles.fila}>
            <p className={styles.usuario}>{usuario}</p>
            <p className={styles.email}>{email}</p>
            {
                status()
            }
            
        </div>
    )
}