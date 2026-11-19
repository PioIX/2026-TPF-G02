"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import Button from "@/components/Button"
import styles from "./page.module.css"
import Avatar from "@/components/Avatar"

export default function MisAlbumes() {
    const router = useRouter()
    const [albumes, setAlbumes] = useState([])
    const [viendo, setViendo] = useState(null)
    const [pasos, setPasos] = useState([])

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem("usuario"))
        if (!usuario) {
            router.replace("/")
            return
        }
        fetch(`http://localhost:4000/mis-albumes?idUsuario=${usuario.id}`)
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    console.log(data.albumes)
                    setAlbumes(data.albumes);
                }
            })
    }, [])

    const ver = (album) => {
        fetch(`http://localhost:4000/pasos?idAlbum=${album.id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.ok) {
                    setPasos(data.pasos)
                    setViendo(album)
                }
            })
    }

    return (
        <main className={styles.pagina}>
            <Header textoVolver="Volver" rutaVolver="/menu" />
            <h1 className={styles.titulo}>{viendo === null ? "Mis álbumes" : `Partida ${viendo.roomcode}`}</h1>
            <section className={styles.panel}>
                {viendo === null ? (
                    // LISTA DE ÁLBUMES
                    albumes.length === 0 ? (
                        <p className={styles.vacio}>Todavía no tenés álbumes. ¡Jugá una partida!</p>
                    ) : (
                        <div className={styles.grilla}>
                            {albumes.map((album) => (
                                <div key={album.id} className={styles.tarjeta}>
                                    {/* vista previa: el último paso del álbum */}
                                    <div className={styles.vista}>
                                        {album.ultimoEsTexto ? (
                                            <p>{album.ultimoContenido}</p>
                                        ) : (
                                            <img src={album.ultimoContenido} alt="Último paso del álbum" />
                                        )}
                                    </div>
                                    <p className={styles.codigo}>Partida {album.roomcode}</p>
                                    <p className={styles.fecha}>{new Date(album.fecha).toLocaleDateString("es-AR")}</p>
                                    <Button txt="Ver" tipo="mentaChico" onClick={() => ver(album)} />
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    // UN ÁLBUM ENTERO
                    <>
                    {pasos.map((paso) => (
                            <div key={paso.orden} className={paso.is_text ? styles.mensajeDerecha : styles.mensaje}>
                                <Avatar nombre={paso.autor} />
                                <div className={styles.burbuja}>
                                    <p className={styles.autor}>{paso.autor}</p>
                                    {paso.is_text ? (
                                        <p className={styles.texto}>{paso.content}</p>
                                    ) : (
                                        <img className={styles.dibujo} src={paso.content} alt={"Dibujo de " + paso.autor} />
                                    )}
                                </div>
                            </div>
                        ))}
                        <div className={styles.botones}>
                            <Button txt="Volver a mis álbumes" onClick={() => setViendo(null)} />
                        </div>
                    </>
                )}
            </section>
        </main>
    )
}