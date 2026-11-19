import Button from "./Button"
import styles from "./UsuariosAdmin.module.css"
export default function UsuariosAdmin({usuario,email,bloqueado,control}){
    function status(){
        if(!bloqueado){
            return(
                <>
                    <p className={styles.activo}>Activo</p>
                    <Button txt="Bloquear" tipo="rojo" onClick={control} />
                </>)
        }else{
            return(
                <>
                    <p className={styles.bloqueado}>Bloqueado</p>
                    <Button txt="Desbloquear" tipo="verde" onClick={control} />
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