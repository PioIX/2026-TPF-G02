"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSocket } from "@/hooks/useSocket"
import Header from "@/components/Header"
import Button from "@/components/Button"
import FilaJugador from "@/components/FilaJugador"
import styles from "./page.module.css"

// Sala de espera. Se abre con /sala?codigo=XXXXX (desde el menú, después de crear o validar la sala).
export default function Sala() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const codigo = searchParams.get("codigo")
    const { socket } = useSocket()

    const [usuario, setUsuario] = useState(null)
    // esto sería lo último que mandó el back: { codigo, anfitrion, estado, minimo, maximo, jugadores }
    const [sala, setSala] = useState(null)
    const [verCompartir, setVerCompartir] = useState(false)
    const [copiado, setCopiado] = useState(false)
    // pasa a ser true true cuando llega la primera lista de jugadores (o sea, cuando ya se entró a la sala)

    const yaEntro = useRef(false)

    // quién soy (lo guardó el login). Si no inició sesión, vuelve al inicio
    useEffect(() => {
        const guardado = localStorage.getItem("usuario")
        if (!guardado) {
            router.replace("/")
            return
        }
        setUsuario(JSON.parse(guardado))
    }, [router])

    // entra a la sala y escucha lo que manda el back 
    useEffect(() => {
        if (!socket || !codigo) {
            return
        }

        socket.emit("unirseSala", { codigo })

        socket.on("estadoSala", (data) => {
            yaEntro.current = true
            setSala(data)
        })

        socket.on("errorSala", (data) => {
            alert(data.mensaje)
            // si todavía no había entrado (sea que tenga el código mal, sala llena, expulsado) vuelve al menú
            if (!yaEntro.current) {
                router.replace("/menu")
            }
        })

        socket.on("expulsado", () => {
            alert("El anfitrión te expulsó de la sala")
            router.replace("/menu")
        })

        // esta pantalla no se hizo todavía
        socket.on("partidaIniciada", (data) => {
            router.push(`/partida?codigo=${data.codigo}`)
        })

        return () => {
            socket.off("estadoSala")
            socket.off("errorSala")
            socket.off("expulsado")
            socket.off("partidaIniciada")
        }
    }, [socket, codigo, router])

     const copiar = () => {
        navigator.clipboard
            .writeText(sala.codigo)
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

    // una fila por cada lugar de la sala: los jugadores que ya entraron y, después, los lugares libres
    // lo que hace Array.from({ length: 8 }) es armar una lista de 8 lugares para poder recorrerla con map
    const lugares = Array.from({ length: sala.maximo })
    const filas = lugares.map((_, i) => {
        const jugador = sala.jugadores[i]
        if (jugador) {
            return (
                <FilaJugador
                    key={jugador.id}
                    nombre={jugador.username}
                    esAnfitrion={jugador.id === sala.anfitrion}
                    onExpulsar={soyAnfitrion && jugador.id !== usuario.id ? () => expulsar(jugador.id) : undefined}
                />
            )
        }
        return <FilaJugador key={"vacio" + i} vacia={true} />
    })
 
    return (
        <div className={styles.pantalla}>
            <Header />
 
            <div className={styles.panel}>
                <h1>Sala de espera</h1>
 
                <div className={styles.codigo}>
                    <span>Código de la sala</span>
                    <strong>{sala.codigo}</strong>
                    <Button txt="Compartir código" tipo="menta" chico={true} onClick={() => setVerCompartir(true)} />
                </div>
 
                <p> Jugadores: {sala.jugadores.length} de {sala.maximo} (mínimo {sala.minimo}) </p>
 
                <div className={styles.lista}>{filas}</div>
            </div> 
        </div>
    )
}