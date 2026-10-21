// Esto seria el círculo con la inicial del usuario. />
import clsx from "clsx"
import styles from "./Avatar.module.css"

//  El color depende de cuántas letras tiene el nombre,
// así un mismo usuario siempre tiene el mismo color en todas las pantallas.

export default function Avatar({ nombre = "", tamano = "mediano" }) {
    const inicial = nombre !== "" ? nombre[0].toUpperCase() : "?"
    const numeroColor = (nombre.length % 8) + 1

    return (
        <span
            className={clsx(styles.avatar, styles[tamano])}
            style={{ background: `var(--avatar-${numeroColor})` }}
        >
            {inicial}
        </span>
    )
}