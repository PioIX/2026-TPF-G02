"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Logo from "./Logo"
import Button from "./Button"
import styles from "./Cabecera.module.css"

export default function Header({ textoVolver, rutaVolver }) {
    const router = useRouter()
    const [usuario, setUsuario] = useState("")

    useEffect(() => {
        const guardado = localStorage.getItem("usuario")
        if (guardado) {
            setUsuario(JSON.parse(guardado))
        }
    }, [])

    return (
        <div className={styles.header}>
            <div>
                {textoVolver && (
                    <Button txt={textoVolver} tipo="oscuro" chico={true} onClick={() => router.push(rutaVolver)} />
                )}
            </div>

            <Logo />

            <div className={styles.derecha}>
                {usuario && (
                    <>
                        <span className={styles.avatar}>{usuario.username[0].toUpperCase()}</span>
                        <span>{usuario.username}</span>
                    </>
                )}
            </div>
        </div>
    )
}