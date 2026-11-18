"use client"
import { useEffect, useState } from "react"
export default function MisAlbumes(){
    const [albumes,setAlbum] = useState([])
    useEffect(()=>{
        fetch("http://localhost:4000/mis-albumes")
        .then(res => res.json)
        .then(data => {
            if (data.ok) {
                console.log(data.albumes)
                setAlbum(data.albumes || []);
            } else {
                console.log(data.mensaje)
            }
        })
    })
    return(
        <main>
            {/*albumes.map((est) => (
                <Moderacion
                key={est.id}
                id={est.id}
                nombre={est.autor}
                tipo={est.is_text}
                data={est.content}
                borrar={() => borrarStep(est.id)}
                />
            ))*/}
        </main>
    )
}