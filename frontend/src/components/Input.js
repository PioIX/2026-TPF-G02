"use client"

import clsx from "clsx"
import styles from "./Input.module.css"

export default function Input({ type = "text", value, onChange, placeholder, variante = "claro", error = "" }) {
    return (
        <div className={styles.contenedor}>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={clsx(styles.input, {
                    [styles.oscuro]: variante === "oscuro",
                    [styles.conError]: error !== "",
                })}
            />
            {error !== "" && <p className={styles.mensaje}>{error}</p>}
        </div>
    )
}