"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import Button from "@/components/Button"

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
        <main>
            <Header textoVolver="Volver" rutaVolver="/menu" />
            <h1>{viendo === null ? "Mis álbumes" : `Partida ${viendo.roomcode}`}</h1>
            <section>
                {viendo === null ? (
                    // LISTA DE ÁLBUMES
                    albumes.length === 0 ? (
                        <p>Todavía no tenés álbumes. ¡Jugá una partida!</p>
                    ) : (
                        <div>
                            {albumes.map((album) => (
                                <div key={album.id}>
                                    {/* vista previa: el último paso del álbum */}
                                    <div>
                                        {album.ultimoEsTexto ? (
                                            <p>{album.ultimoContenido}</p>
                                        ) : (
                                            <img src={album.ultimoContenido} alt="Último paso del álbum" />
                                        )}
                                    </div>
                                    <p>Partida {album.roomcode}</p>
                                    <p>{new Date(album.fecha).toLocaleDateString("es-AR")}</p>
                                    <Button txt="Ver" tipo="menta" chico={true} onClick={() => ver(album)} />
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    // UN ÁLBUM ENTERO
                    <>
                    </>
                )}
            </section>
        </main>
    )
}