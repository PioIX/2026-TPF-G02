"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import clsx from "clsx"
import { useSocket } from "@/hooks/useSocket"
import styles from "./page.module.css"
import Button from "@/components/Button"
export default function AlbumsRevelacion() {
    const { socket } = useSocket()
    const router = useRouter()
    const [anfitrion,setAnfitrion] = useState(false)
    const [content,setContent] = useState({})
    const [totalrend,setTotalrend] = useState(null)
    const [players,setPlayers] = useState([])
    const [album,setAlbum] = useState(0) 
    const [paso,setPaso] = useState(-1) 
    const [fin,setFin] = useState(false)
    const code = localStorage.getItem("code")
    //SOCKET
    useEffect(() => {
        if (!socket) return 
        const usuario = JSON.parse(localStorage.getItem("usuario")) 
        socket.emit("unirseSala", { usuario })
        socket.on("albums", (data) => {
            console.log(data)
            setContent(data.content)
            setAnfitrion(data.anfitrion === usuario.id)
            setPlayers(data.players)
            setAlbum(data.album) 
            setPaso(data.paso) 
        })
        socket.on("pasoRevelado", (data) => {
            if (data.fin) {
                setTotalrend(<h3>SE TERMINÓ.</h3>)
                setFin(true)
            } else {
                setAlbum(data.album)
                setPaso(data.paso)
            }
        })
        
    }, [socket]);

    //PAGINA

    function revelar() {
        socket.emit("revelar", { usuario: JSON.parse(localStorage.getItem("usuario")) })
    }

    const albumActual = content[album]
    const pasosVisibles = albumActual ? albumActual.pasos.filter((pasoDelAlbum, i) => i <= paso) : []
    const dueno = albumActual ? albumActual.dueno : ""
    const finDelAlbum = albumActual && paso === albumActual.pasos.length - 1

    return(
        <main className={styles.pagina}>
            <div className={styles.contenido}>
                <section>
                    <h2 className={styles.titulo}>JUGADORES</h2>
                    <div className={styles.panelJugadores}>
                        {players.map(player => (
                            <div key={player.id} className={clsx(styles.jugador, { [styles.resaltado]: player.username === dueno })}>
                                <p>{player.username}</p>
                            </div>
                        ))}
                    </div>
                </section>
                <section>
                    <h2 className={styles.titulo}>ALBUM DE {dueno}</h2>
                    <div className={styles.panelAlbum}>
                        {/*esto seria el album*/}
                        {pasosVisibles.map((p, i) => (
                            <div key={i} className={clsx(styles.mensaje, { [styles.derecha]: p.esTexto })}>
                                <p className={styles.autor}>{p.autor}</p>
                                {p.esTexto ? <p className={styles.texto}>{p.contenido}</p> : <img className={styles.dibujo} src={p.contenido}></img>}
                            </div>
                        ))}
                        {totalrend}
                        <div className={styles.botones}>
                            {fin ? (
                                <Button onClick={() => router.push(`/salas?codigo=${code}`)} txt="Volver a la sala"></Button>
                            ) : anfitrion ? (
                                <Button onClick={revelar} txt={finDelAlbum ? "Seguir" : "Revelar"} disabled={!anfitrion}></Button>
                            ) : (
                                <p>Lo avanza el anfitrión</p>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}
