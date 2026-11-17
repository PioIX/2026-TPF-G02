"use client"
import { useEffect, useState } from "react"
import { useSocket } from "@/hooks/useSocket"
import Button from "@/components/Button"
export default function AlbumsRevelacion() {
    const { socket } = useSocket()
    const [player,setPlayer] = useState("")
    const [anfitrion,setAnfitrion] = useState(false)
    const [content,setContent] = useState({})
    const [nextrend,setNextrend] = useState("")
    const [totalrend,setTotalrend] = useState(null)
    const [players,setPlayers] = useState({})
    
    //albumDe(user.id).pasos.push({
//    idAutor: user.id,
//    autor: user.username,
//    esTexto: esTexto,
//    contenido: contenido,
    //SOCKET
    useEffect(() => {
        socket.on("albums", (data) => {
            console.log(data)
            setContent(data.content)
            setAnfitrion(data.anfitrion)
            setPlayers(data.players)
        })
    }, [socket]);

    function llamado() {
        socket.emit("emitea albums")
    }

    //PAGINA

    let a=0
    let b=0

    function revelar() {
        for (let i = 0; i < content.length; i++) {
            if (a>content.length) {
                setTotalrend(<h3>SE TERMINO.</h3>)
                return
            }
            if (i==a) {
                for (let j = 0; j < content.i.length; j++) {
                    if (j==content.i.length) {
                        a++
                        b=0
                    }
                    if (j==b) {
                        if (j==0) {
                            setPlayer(content[i,j,2])
                        }
                        if (content[i,j,0]==true) {
                            setNextrend(<p>{content[i,j,1].contenido}</p>)
                        } else {
                            setNextrend(<img src={content[i,j,1].contenido}></img>)
                        }
                        b++
                        return
                    }
                }
            }
        }
    }

    useEffect(() => {
        setTotalrend(totalrend+nextrend)
    }, [nextrend]);

    return(
        <>
        <h2 onLoad={llamado}>JUGADORES</h2>
        <div>
            {/* {players.map(player => (
                <div key={player.id}>
                    <img src={player.img}></img>
                    <p>{player.nombre}</p>
                </div>
            ))} */}
        </div>
        <h2>ALBUM DE {player}</h2>
        <div>
            {/*esto seria el album*/}
            {totalrend}
            <Button onclick={revelar} txt="Revelar" disabled={!anfitrion}></Button>
        </div>
        </>
    )
}
