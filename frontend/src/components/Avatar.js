// Esto seria el círculo con la inicial del usuario. />
import styles from "./Avatar.module.css"

//  El color depende de cuántas letras tiene el nombre,
// así un mismo usuario siempre tiene el mismo color en todas las pantallas.

export default function Avatar({ nombre = "" }) {
    const inicial = nombre !== "" ? nombre[0].toUpperCase() : "?"
    const numeroColor = (nombre.length % 8) + 1

    return (
        <span
            className={styles.avatar}
            style={{ background: `var(--avatar-${numeroColor})` }}
        >
            {inicial}
        </span>
    )
}