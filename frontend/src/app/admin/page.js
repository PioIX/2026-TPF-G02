"use client"

import EditFrases from "@/components/EditFrases"
import { useState,useEffect } from "react"

export default function Admin() {
    const [option,setOption] = useState(0)
    const [frases,setFrases] = useState([])
    // Traer datos
        useEffect(() => {
            fetch("http://localhost:3001/estudiantes")
            .then(response => response.json())
            .then(data => {
            setFrases(data);
      });}, []);
        const [datos,setDatos] = useState()
    // Funciones para los botones de editar frases
    const edit = (id) => {
        let nuevo = prompt("Ingrese la nueva frase")
        setDatos({
            nombre: nuevo
        })
        fetch(`http://localhost:3001/editFrase/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
    })
        .then(response => response.json())
        .then(data => console.log("actualizado", data));
    }
    const borrar = (id) => {
            fetch(`http://localhost:3001/estudiantes/${id}`, {
            method: 'DELETE'
            })
            .then(response => {
            if (response.ok) {
            }
            });
    }
    // Reenderizado
    const reenderizar = () =>{
        if (option === 0) return <p>Seleccione una opción</p>;
        if (option === 1) return(
        /*    <div>
                <button> + Nueva Frase </button>
                    {frases.map(est => (
                        <EditFrases
                         key={est.id}
                         nombre={est.frase}
                         edit={edit(est.id)}
                         borrar={borrar(est.id)}
                        />
                    ))}
                </div>;*/
                <p>Todo bien acá en frases </p>);
        if (option === 2) return( 
            <p>Todo bien acá en Moderación</p>);
        if (option === 3) return( 
            <p>Todo bien con Usuarios</p>);
    }
    return(
        <>
            <h1>Panel de administrador</h1>
            <button onClick={() => setOption(1)}>Frases</button>
            <button onClick={() => setOption(2)}>Moderación</button>
            <button onClick={() => setOption(3)}>Usuarios</button>
            {
                reenderizar()
            }
        </>
    )
}