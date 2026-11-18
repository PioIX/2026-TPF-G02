"use client"
import { useState } from "react";
import styles from "./page.module.css"
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
export default function Menu() {
    const [codigo, setCodigo] = useState("")
    const router = useRouter()
    const crear = () => {
        const verif = {
            usuario: JSON.parse(localStorage.getItem("usuario"))
        }
        fetch("http://localhost:4000/salas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(verif)
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.ok) {
                    router.push(`/salas?codigo=${data.codigo}`)
                } else {
                    alert(data.mensaje)
                }
            })
    }
    const unirse = () => {
        router.push(`/salas?codigo=${codigo}`)
    }
    return (
        <main className={styles.pagina}>
            <Header textoVolver="Salir" rutaVolver="/" />
            <h1>¿Qué queres hacer?</h1>
            <section className={styles.opciones}>
                <div className={styles.tarjeta}>
                    <h2 className={styles.tarjetaTitulo}>CREAR SALA</h2>
                    <span className={styles.circulo} />
                    <p className={styles.texto} >Crea una sala nueva y comparti el codigo con tus amigos.</p>
                    <button className={styles.boton} onClick={crear}>
                        <span className={styles.play} />
                        CREAR SALA</button>
                </div>
                <div className={styles.tarjeta}>
                    <h2 className={styles.tarjetaTitulo} >UNIRSE A SALA</h2>
                    <p className={styles.texto} >Ingresa el código que te pasaron</p>
                    <input
                        className={styles.codigo}
                        type="text"
                        placeholder={"12345"}
                        value={codigo}
                        onChange={(e) => { setCodigo(e.target.value) }}
                        maxLength={5}
                    />
                    <button className={styles.boton} disabled={codigo.length < 5} onClick={unirse}>
                        <span className={styles.play} />
                        UNIRSE</button>
                </div>
            </section>
            <footer className={styles.pie}>
                <button className={styles.secundario} onClick={() => router.push("/misalbumes")}>MIS ÁLBUMES</button>
            </footer>
        </main>
    )
}