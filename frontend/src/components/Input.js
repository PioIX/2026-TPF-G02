"use client"
import styles from "./Input.module.css"

export default function Input({ type = "text", value, onChange, placeholder}) {
    return (
        <div className={styles.contenedor}>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={styles.input}
            />
        </div>
    )
}