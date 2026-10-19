"use client"

import clsx from "clsx"
import styles from "./Button.module.css"

export default function Button({ txt, tipo = "claro", chico = false, onClick, disabled = false }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={clsx(styles.button, {
                [styles.menta]: tipo === "menta",
                [styles.violeta]: tipo === "violeta",
                [styles.oscuro]: tipo === "oscuro",
                [styles.rojo]: tipo === "rojo",
                [styles.verde]: tipo === "verde",
                [styles.chico]: chico,
            })}
        >
            {txt}
        </button>
    )
}