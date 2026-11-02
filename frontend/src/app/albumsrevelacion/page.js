import { useState } from "react"

export default function AlbumsRevelacion() {
    const [player,setPlayer] = useState("")
    const [admin,setAdmin] = useState(false)
    const [content,setContent] = useState({})
    const [nextrend,setNextrend] = useState("")
    
    let a=0
    let b=0

    function revelar() {
        for (let i = 0; i < array.length; i++) {
            if (i==a) {
                for (let j = 0; j < array.length; j++) {
                    if (j==b) {
                        setPlayer(content[i,j,2])
                        if (content[i,j,0]==true) {
                            setNextrend(<p>{content[i,j,1].contenido}</p>)
                        } else {
                            setNextrend(<img src={content[i,j,1].contenido}></img>)
                        }
                    }
                }
            }
        }
    }

    return(
        <>
        <h2>JUGADORES</h2>
        <div>
            players
        </div>
        <h2>ALBUM DE ${player}</h2>
        <div>
            album
            <Button onclick={revelar} txt="Revelar" disabled={!admin}></Button>
        </div>
        </>
    )
}


//ejemplo array content
/*
{
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
}
*/