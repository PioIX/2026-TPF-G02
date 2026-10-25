import styles from "./UsuariosAdmin.module.css"
export default function UsuariosAdmin({usuario,email,bloqueado,control}){
    function status(){
        if(bloqueado === 0){
            return(
                    <p className={styles.activo}>Activo</p>
            )
        }else{
            return( 
                <p className={styles.bloqueado}>Bloqueado</p>)
        }
    }
    return(
        <div className={styles.fila}>
            <p className={styles.usuario}>{usuario}</p>
            <p className={styles.email}>{email}</p>
            {
                status()
            }
            <button className={styles.boton} onClick={control}>Desbloquear</button>
        </div>
    )
}