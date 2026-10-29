"use client"
import { useState } from "react";
import styles from "./page.module.css"
import { useRouter } from "next/navigation";
export default function Menu(){
    const [nuevo,setNuevo] = useState("")
    const [codigo,setCodigo] = useState("")
    const router = useRouter()
    const volver = () => {
        router.replace("http://localhost:3000/")
    }
    const crear = () =>{
        fetch("http://localhost:4000/salas")
    }
    return(
        <main className={styles.pagina}>
            <header>
                <button className={styles.salir} onClick={volver}>
                    <span className={styles.flecha} />
                    Salir
                </button>
                <h1>¿Qué queres hacer?</h1>
            </header>
            <section className={styles.opciones}>
                <div className={styles.tarjeta}> 
                    <h2 className={styles.tarjetaTitulo}>CREAR SALA</h2>
                    <span className={styles.circulo}/>
                    <input
                        className={styles.codigo}
                        type="text"
                        placeholder={"AAAAA"}
                        value={nuevo}
                        onChange={(e) => {setNuevo(e.target.value)}}
                        maxLength={5}
                    />                    
                    <p className={styles.texto} >Crea una sala nueva y comparti el codigo con tus amigos.</p>
                    <button className={styles.boton} onClick={crear} disabled={nuevo.length < 5}>
                        <span className={styles.play}/>
                        CREAR SALA</button>
                </div>
                <div  className={styles.tarjeta}>
                    <h2 className={styles.tarjetaTitulo} >UNIRSE A SALA</h2>
                    <p className={styles.texto} >Ingresa el código que te pasaron</p>
                    <input
                        className={styles.codigo}
                        type="text"
                        placeholder={"AAAAA"}
                        value={codigo}
                        onChange={(e) => {setCodigo(e.target.value)}}
                        maxLength={5}
                    />
                    <button className={styles.boton} disabled={codigo.length < 5}>
                        <span className={styles.play} />
                        UNIRSE</button>
                </div>
            </section>
            <footer className={styles.pie}>
                <button className={styles.secundario}>MIS ÁLBUMES</button>
                <button className={styles.secundario}>MIS PARTIDAS</button>
            </footer>
        </main>
    )
}