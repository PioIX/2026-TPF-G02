"use client"

import styles from "./Modal.module.css"

// Uso:
// <Modal abierto={mostrar} titulo="Compartir" onCerrar={() => setMostrar(false)}>
//     <p>A7K2Q</p>
// </Modal>
export default function Modal({ abierto, titulo, onCerrar, children }) {
    if (!abierto) {
        return null
    }

    return (
        <div className={styles.fondo} onClick={onCerrar}>
            {/* stopPropagation: si se toca adentro de la ventana, no se cierra */}
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.titulo}>{titulo}</h2>
                <div className={styles.contenido}>{children}</div>
            </div>
        </div>
    )
}