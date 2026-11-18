"use client"
import styles from "./Button.module.css"

export default function Button({ txt, tipo = "claro", flecha = false, onClick, disabled = false }) {
    return (
        <button onClick={onClick} disabled={disabled} className={styles[tipo]}>         
            {flecha && <span className={styles.flecha} />}
            {txt}
        </ button>
    )
}