"use client"
import { useEffect, useState } from "react"
import Button from "@/components/Button"
export default function AlbumsRevelacion() {
    const [player,setPlayer] = useState("")
    const [anfitrion,setAnfitrion] = useState(false)
    const [content,setContent] = useState({})
    const [nextrend,setNextrend] = useState("")
    const [totalrend,setTotalrend] = useState(null)
    const [players,setPlayers] = useState({})
    
    //SOCKET

    socket.on("albums", (data) => {
        setContent(data.content)
        setAnfitrion(data.anfitrion)
        setPlayers(data.players)
    })

    //PAGINA

    {players.map(player => (
        <div key={player.id}>
            <img src={player.img}></img>
            <p>{player.nombre}</p>
        </div>
    ))}

    let a=0
    let b=0

    function revelar() {
        for (let i = 0; i < content.length; i++) {
            if (a>content.length) {
                setTotalrend(<h3>Se termino, JUUUUUUUUUUAQUIIIIIIIIIIII</h3>)
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

    //ejemplo array content

/*{
    album1:{
        step1:{
            text:true
            contenido:lorem
            id:1
        }
        step2:{
            text:true
            contenido:lorem
            id:2
        }
        step3:{
            text:true
            contenido:lorem
            id:3
        }
        step4:{
            text:true
            contenido:lorem
            id:4
        }
    }
    album2:{}
    album3:{}
}*/


    return(
        <>
        <h2>JUGADORES</h2>
        <div>
            players
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
