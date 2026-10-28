"use client"
import { useEffect, useState } from "react"
import styles from "./page.module.css"
export default function Escribir(){
    const [texto,setTexto] = useState("")
    const fraseAzar = () =>{
            fetch("http://localhost:4000/frases/azar")
            .then(response => response.json())
            .then(data => {
                if(data.ok){
                    setTexto(data.frase)
                    console.log(frases)
                }else{
                    console.log(data.mensaje)
                }});
        }
    return(
        <main className={styles.pagina}>
            <div className={styles.libreta}>
                <div className={styles.anillos}>
                    {[0, 1, 2, 3, 4].map(i => (
                        <span key={i} className={styles.anillo} />
                    ))}
                </div>

                <div className={styles.lineas}>
                    <span className={styles.linea} />
                    <span className={styles.linea} />
                    <span className={styles.linea} />
                </div>

                <svg className={styles.lapiz} viewBox="0 0 60 122" aria-hidden="true">
                    <rect x="14" y="2" width="32" height="16" rx="6" fill="#e86a6a" />
                    <rect x="14" y="18" width="32" height="10" fill="#b9b9b9" />
                    <rect x="14" y="28" width="20" height="60" fill="#ffc93c" />
                    <rect x="34" y="28" width="12" height="60" fill="#e0a63a" />
                    <polygon points="14,88 46,88 30,118" fill="#f4c7a1" />
                    <polygon points="25,108 35,108 30,118" fill="#222" />
                </svg>
            </div>
        <div className={styles.controles}>
            <input className={styles.input}
             value={texto}
             placeholder={"Un arbol con una manzana"}
            onChange={(e)=>{setTexto(e.target.value)}}/>

            <button className={styles.hecho}>
                <span className={styles.play} />
                Hecho</button>
            <button className={styles.azar} onClick={fraseAzar}>
                    Frase al azar
            </button>
        </div>
        </main>
    )
}