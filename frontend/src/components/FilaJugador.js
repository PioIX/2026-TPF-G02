import Avatar from "./Avatar"
import Button from "./Button"
import styles from "./FilaJugador.module.css"

export default function FilaJugador({ nombre = "", esAnfitrion = false, vacia = false, onExpulsar }) {
    if (vacia) {
        return <div className={styles.vacia}>Esperando jugador...</div>
    }

    return (
        <div className={styles.fila}>
            <Avatar nombre={nombre} />
            <span className={styles.nombre}>{nombre}</span>
            {esAnfitrion && <span className={styles.etiqueta}>Anfitrión</span>}
            {onExpulsar && <Button txt="Expulsar" tipo="rojoChico" onClick={onExpulsar} />}
        </div>
    )
}