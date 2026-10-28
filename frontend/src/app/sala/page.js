"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSocket } from "@/hooks/useSocket"

// Sala de espera. Se abre con /sala?codigo=XXXXX (desde el menú, después de crear o validar la sala).
export default function Sala() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const codigo = searchParams.get("codigo")
    const { socket } = useSocket()

    const [usuario, setUsuario] = useState(null)
    // esto sería lo último que mandó el back: { codigo, anfitrion, estado, minimo, maximo, jugadores }
    const [sala, setSala] = useState(null)
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
}