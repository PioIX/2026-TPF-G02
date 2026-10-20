"use client"

import clsx from "clsx"
import styles from "./Input.module.css"

export default function Input({ type = "text", value, onChange, placeholder, variante = "claro", error = "", maxLength }) {
    return (
        <div className={styles.contenedor}>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                maxLength={maxLength}
                className={clsx(styles.input, {
                    [styles.oscuro]: variante === "oscuro",
                    [styles.conError]: error !== "",
                })}
            />
            {error !== "" && <p className={styles.mensaje}>{error}</p>}
        </div>
    )
}