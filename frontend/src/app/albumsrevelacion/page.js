"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSocket } from "@/hooks/useSocket"
import styles from "./page.module.css"
import Button from "@/components/Button"
import Header from "@/components/Header"
import Avatar from "@/components/Avatar"
export default function AlbumsRevelacion() {
    const { socket,isConnected } = useSocket()
    const router = useRouter()
    const [anfitrion,setAnfitrion] = useState(false)
    const [content,setContent] = useState({})
    const [players,setPlayers] = useState([])
    const [album,setAlbum] = useState(0) 
    const [paso,setPaso] = useState(-1) 
    const [fin,setFin] = useState(false)
    const [idAnfitrion, setIdAnfitrion] = useState(null)
    //SOCKET
    useEffect(() => {
        if (!socket) return
        const usuario = JSON.parse(localStorage.getItem("usuario"))
        socket.on("albums", (data) => {
            setContent(data.content)
            setAnfitrion(data.anfitrion === usuario.id)
            setIdAnfitrion(data.anfitrion)
            setPlayers(data.players)
            setAlbum(data.album)
            setPaso(data.paso)
        })
        socket.on("pasoRevelado", (data) => {
            if (data.fin) {
                setFin(true)
            } else {
                setAlbum(data.album)
                setPaso(data.paso)
            }
        })

    }, [socket]);

    useEffect(() => {
        if(!isConnected) return;
        socket.emit("unirseSala", {usuario: JSON.parse(localStorage.getItem("usuario")) })
    }, [isConnected])

    //PAGINA

    function revelar() {
        socket.emit("revelar", { usuario: JSON.parse(localStorage.getItem("usuario")) })
    }

    const albumActual = content[album]
    const pasosVisibles = albumActual ? albumActual.pasos.filter((pasoDelAlbum, i) => i <= paso) : []
    const dueno = albumActual ? albumActual.dueno : ""
    const finDelAlbum = albumActual && paso === albumActual.pasos.length - 1

    return (
        <main className={styles.pagina}>
            <Header textoVolver="Inicio" rutaVolver="/menu" />
            <div className={styles.contenido}>
                <section>
                    <h2 className={styles.titulo}>JUGADORES</h2>
                    <div className={styles.panelJugadores}>
                        {players.map(player => (
                            <div key={player.id} className={player.username === dueno ? styles.jugadorResaltado : styles.jugador}>
                                <Avatar nombre={player.username} />
                                <p>{player.username}</p>
                                {player.id === idAnfitrion && <span className={styles.corona}>♛</span>}
                            </div>
                        ))}
                    </div>
                </section>
                <section>
                    <h2 className={styles.titulo}>ÁLBUM DE {dueno}</h2>
                    <div className={styles.panelAlbum}>
                        {/*esto seria el album*/}
                        {pasosVisibles.map((p, i) => (
                            <div key={i} className={p.esTexto ? styles.mensajeDerecha : styles.mensaje}>
                                <Avatar nombre={p.autor} />
                                <div className={styles.burbuja}>
                                    <p className={styles.autor}>{p.autor}</p>
                                    {p.esTexto ? <p className={styles.texto}>{p.contenido}</p> : <img className={styles.dibujo} src={p.contenido}></img>}
                                </div>
                            </div>
                        ))}
                        {fin && <h3>SE TERMINÓ.</h3>}
                        <div className={styles.botones}>
                            {fin ? (
                                <Button onClick={() => router.push("/menu")} txt="Volver al menú"></Button>
                            ) : anfitrion ? (
                                <Button onClick={revelar} txt={finDelAlbum ? "Seguir" : "Revelar"}></Button>
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
