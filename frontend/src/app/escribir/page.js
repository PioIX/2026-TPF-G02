"use client"
import { useEffect, useState } from "react"
import styles from "./page.module.css"
import { useRouter } from "next/navigation"
import { useSocket } from "@/hooks/useSocket"
import Logo from "@/components/Logo"
export default function Escribir() {
    const { socket } = useSocket()
    const router = useRouter()
    const CIRCUNFERENCIA = 2 * Math.PI * 9
    const [tiempo, setTiempo] = useState(20)
    const [tiempoTotal, setTiempoTotal] = useState(20)
    const [ronda, setRonda] = useState(1)
    const [enviado, setEnviado] = useState(false)
    const [texto, setTexto] = useState("")
    const [dibujo, setDibujo] = useState("")
    const [totalRondas, setTotalRondas] = useState(1)
    const fraccion = tiempo / tiempoTotal

    const fraseAzar = () => {
        fetch("http://localhost:4000/frases/azar")
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    setTexto(data.frase)
                } else {
                    console.log(data.mensaje)
                }
            });
    }
    useEffect(() => {
        const timer = setInterval(() => setTiempo(prev => (prev > 0 ? prev - 1 : 0)), 1000);
        return () => clearInterval(timer); // cleanup
    }, []);
    useEffect(() => {
        if (tiempo === 0 && !enviado && texto !== "") {
            terminar()
        }
    })

    //SOCKET

    function terminar() {
        console.log(JSON.parse(localStorage.getItem("usuario")), texto)
        socket.emit("envio", { usuario: JSON.parse(localStorage.getItem("usuario")), contenido: texto, esTexto: true })
        setEnviado(true)
    }

    useEffect(() => {
        if (!socket) return;
        socket.emit("unirseSala", { usuario: JSON.parse(localStorage.getItem("usuario")) })
        socket.on("nextStep", (data) => {
            if (data.nextstep == true) {
                router.push("/dibujar")
            } else {
                router.push("/albumsrevelacion")
            }
        })

        socket.on("recepcion", (data) => {
            if (data.recibido && !data.recibido.esTexto) {
                console.log(data.recibido, " ", data.recibido.contenido)
                setDibujo(data.recibido.contenido)
            }
            setRonda(data.ronda)
            setTotalRondas(data.totalRondas)
            setTiempo(data.segundos)
            setTiempoTotal(data.segundos)
            setEnviado(data.enviado)
        })
    }, [socket]);


    return (
        <main className={styles.pagina}>
            <header className={styles.header}>
                <p className={styles.ronda}>{ronda}/{totalRondas}</p>
                <Logo />
                <svg
                    className={styles.cronometro}
                    viewBox="0 0 64 64"
                    role="img"
                    aria-label={`Quedan ${tiempo} segundos`}
                >
                    <rect x="25" y="2" width="14" height="6" rx="2" fill="white" />
                    <rect x="29" y="8" width="6" height="6" fill="white" />
                    <rect x="49" y="12" width="10" height="5" rx="2" fill="white" transform="rotate(45 54 14.5)" />
                    <circle cx="32" cy="38" r="22" fill="none" stroke="white" strokeWidth="5" />
                    <circle
                        className={styles.pie}
                        cx="32" cy="38" r="9"
                        fill="none"
                        stroke="white"
                        strokeWidth="18"
                        strokeDasharray={`${fraccion * CIRCUNFERENCIA} ${CIRCUNFERENCIA}`}
                        transform="rotate(-90 32 38)"
                    />
                </svg>
            </header>

            {dibujo !== "" ? (
                <img className={styles.dibujo} src={dibujo} alt="Dibujo para describir" />

            ) : (
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
            )}

            {enviado ? (
                <h1 className={styles.titulo}>Esperando a los demás jugadores...</h1>
            ) : (
                <>
                    <h1 className={styles.titulo}>{dibujo !== "" ? "Describí lo que ves" : "Escribí una frase"}</h1>
                    <div className={styles.controles}>
                        <input className={styles.input}
                            value={texto}
                            placeholder={"Un árbol con una manzana"}
                            onChange={(e) => { setTexto(e.target.value) }} />
                        <button className={styles.hecho} onClick={terminar} disabled={texto === ""}>
                            <span className={styles.play} />
                            Hecho
                        </button>
                        {dibujo === "" && (
                            <button className={styles.azar} onClick={fraseAzar}>
                                Frase al azar
                            </button>
                        )}
                    </div>
                </>
            )}
        </main>
    )
}