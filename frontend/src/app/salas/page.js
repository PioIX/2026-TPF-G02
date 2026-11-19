"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSocket } from "@/hooks/useSocket"
import Header from "@/components/Header"
import Button from "@/components/Button"
import FilaJugador from "@/components/FilaJugador"
import styles from "./sala.module.css"
import Popup from "reactjs-popup"

export default function Sala() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const codigo = searchParams.get("codigo")
    //const usuario = searchParams.get("user")
    console.log(codigo)
    const [usuario, setUsuario] = useState("")
    const { socket, isConnected } = useSocket()
    console.log(isConnected)
    //const [usuario, setUsuario] = useState(null)
    // esto sería lo último que mandó el back: { codigo, anfitrion, estado, minimo, maximo, jugadores }
    const [sala, setSala] = useState()
    const [verCompartir, setVerCompartir] = useState(false)
    const [copiado, setCopiado] = useState(false)
    // pasa a ser true true cuando llega la primera lista de jugadores (o sea, cuando ya se entró a la sala)

    const yaEntro = useRef(false)

    // quién soy (lo guardó el login). Si no inició sesión, vuelve al inicio
    useEffect(() => {
        const user = localStorage.getItem("usuario")
        console.log("user", JSON.parse(user))
        if (!user) {
            router.replace("/")
            return
        }
        setUsuario(JSON.parse(user))
    }, [router])

    useEffect(() => {
        if(!isConnected) return;
            socket.emit("unirseSala", { codigo, usuario: JSON.parse(localStorage.getItem("usuario")) })
    })

    // entra a la sala y escucha lo que manda el back 
    useEffect(() => {
        if (!socket || !codigo || !usuario) {
            return
        }
        socket.on("estadoSala", (data) => {
            console.log(data)
            yaEntro.current = true
            setSala(data)
        })
        socket.on("errorSala", (data) => {
            alert(data.mensaje)
            // si todavía no había entrado (sea que tenga el código mal, sala llena, expulsado) vuelve al menú
            if (!yaEntro.current) {
                router.push("/menu")
            }
        })

        socket.on("expulsado", () => {
            alert("El anfitrión te expulsó de la sala")
            router.replace("/menu")
        })

        socket.on("partidaIniciada", () => {
            router.push("/escribir")
        })

        return () => {
            socket.off("estadoSala")
            socket.off("errorSala")
            socket.off("expulsado")
            socket.off("partidaIniciada")
        }
    }, [socket, codigo, usuario, router])

    const expulsar = (idJugador) => {
        socket.emit("expulsarJugador", { usuario, idJugador })
    }

    const iniciarPartida = () => {
        socket.emit("iniciarPartida", { usuario })
    }

    const salir = () => {
        socket.emit("salirSala", { usuario })
        router.replace("/menu")
    }

    const copiar = () => {
        navigator.clipboard
            .writeText(codigo)
            .then(() => {
                setCopiado(true)
                setTimeout(() => setCopiado(false), 2000)
            })
            .catch(() => alert("No se pudo copiar, escribilo a mano"))
    }

    if (!sala || !usuario) {
        return (
            <div className={styles.pantalla}>
                <Header />
                <p className={styles.cargando}>Entrando a la sala...</p>
            </div>
        )
    }

    const soyAnfitrion = sala.anfitrion === usuario.id

    // Ahora se recorren las filas de los jugadores que ya entraron (map recorre la lista de jugadores)
    console.log(sala)
    const filas = sala.jugadores.map((jugador) => (
        <FilaJugador
            key={jugador.id}
            nombre={jugador.username}
            esAnfitrion={jugador.id === sala.anfitrion}
            onExpulsar={soyAnfitrion && jugador.id !== usuario.id ? () => expulsar(jugador.id) : undefined}
        />
    ))

    // después pasamos a los lugares libres. 
    // De la lista de números de lugar (el máximo de la sala es 8), filter se queda solo con los que todavía no ocupó ningún jugador.
    const numerosDeLugar = [1, 2, 3, 4, 5, 6, 7, 8]
    const lugaresLibres = numerosDeLugar.filter((n) => n > sala.jugadores.length && n <= sala.maximo)
    lugaresLibres.forEach((n) => {
        filas.push(<FilaJugador key={"vacio" + n} vacia={true} />)
    })



    return (
        <div className={styles.pantalla}>
            <Header />

            <div className={styles.panel}>
                <h1>Sala de espera</h1>

                <div className={styles.codigo}>
                    <span>Código de la sala</span>
                    <strong>{sala.codigo}</strong>
                    <Button txt="Compartir código" tipo="mentaChico" onClick={() => setVerCompartir(true)} />
                </div>

                <p> Jugadores: {sala.jugadores.length} de {sala.maximo} (mínimo {sala.minimo}) </p>

                <div className={styles.lista}>{filas}</div>

                <div className={styles.botones}>
                    {soyAnfitrion ? (
                        <Button
                            txt="Iniciar partida"
                            tipo="violeta"
                            onClick={iniciarPartida}
                            disabled={sala.jugadores.length < sala.minimo}
                        />
                    ) : (
                        <p>Esperando a que el anfitrión inicie la partida...</p>
                    )}
                    <Button txt="Salir de la sala" onClick={salir} />
                </div>
            </div>

            <Popup open={verCompartir} onClose={() => setVerCompartir(false)} modal>
                <div className={styles.fondoModal}>
                    <div className={styles.modal}>
                        <h2>Compartí el código</h2>
                        <p>Tus amigos tienen que elegir &quot;Unirse a una sala&quot; y escribir este código:</p>
                        <strong className={styles.codigoGrande}>{sala.codigo}</strong>
                        <div className={styles.botonesModal}>
                            <Button txt={copiado ? "¡Copiado!" : "Copiar código"} tipo="menta" onClick={copiar} />
                            <Button txt="Cerrar" onClick={() => setVerCompartir(false)} />
                        </div>
                    </div>
                </div>
            </Popup>
        </div>
    )
}