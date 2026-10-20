"use client"

import clsx from "clsx"
import styles from "./Pestañas.module.css"

export default function Pestañas({ opciones, activa, onCambiar }) {
    return (
        <div className={styles.pestañas}>
            {opciones.map((op) => (
                <button
                    key={op.valor}
                    className={clsx(styles.pestaña, { [styles.activa]: activa === op.valor })}
                    onClick={() => onCambiar(op.valor)}
                >
                    {op.texto}
                </button>
            ))}
        </div>
    )
}