"use client"

import { useState } from "react"

export default function Admin() {
    const [mostrarFrases, setMostrarFrases] = useState(false)
    const [frases,setFrases] = useState([])
    const divFrases = () =>{
        useEffect(() => {
            fetch("http://localhost:3001/estudiantes")
            .then(response => response.json())
            .then(data => {
            setFrases(data);
      });
  }, []);
    }
    return(
        <>
            <h1>Panel de administrador</h1>
            <button onClick={divFrases}>Frases</button>
            <button onClick={""}>Moderación</button>
            <button onClick={""}>Usuarios</button>
            {
                mostrarFrases ? <div>
                    <button> + Nueva Frase </button>
                    {frases.map(est => (
                        <></>
                    ))}
                </div>
                     : ""
            }
        </>
    )
}