"use client"

import EditFrases from "@/components/EditFrases"
import { useSearchParams } from "next/navigation"
import { useState,useEffect } from "react"

export default function Admin() {
    const searchParams = useSearchParams()
    // Variables para controlar datos de lo que viene -\(¨)/-
    const [frases,setFrases] = useState([])
    // Variable para las opciones de lo que se muestra en el div de abajo
    const [option,setOption] = useState(0)
    // Controlador de actualizacion para los nuevos datos
    const [update,setUpdate] = useState((true))
    //Recibir datos de la URL
    const user = searchParams.get("user")
    // Traer datos
    if(update){
        setUpdate(false)
        useEffect(() => {
            fetch("http://localhost:4000/") //completar con get correcto
            .then(response => response.json())
            .then(data => {
            setFrases(data);});
        }, [update]);
        useEffect(()=>{
            fetch("http://localhost:4000/") //completar con get correcto
            .then(response => response.json())
            .then(data => {
            setModeracion(data);
        },[update])})
    }
    // Funcion para agregar frase
    const nueva = () =>{
        setDatos({
        // Poner usuario y frase cuando se pueda pedir   
        })
         fetch("http://localhost:4000/agregarFrase  ", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        })
            .then(response => response.json())
            .then(data => {setFrases([...frases, data]),
                setUpdate(true)
            });
            }

        const [datos,setDatos] = useState()
    // Funciones para los botones de editar frases
    const edit = (id) => {
        let nuevo = prompt("Ingrese la nueva frase")
        setDatos({
            // Poner id, usuario y frase cuando se pueda pedir   
        })
        fetch(`http://localhost:4000`, { //completar con put correcto
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
    })
        .then(response => response.json())
        .then(data => {console.log("actualizado", data),
            setUpdate(true)
        });
    }
    const borrar = (id) => {
            fetch(`http://localhost:4000/`, { //completar con delete correcto
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
                <button onClick={() => nueva()}> + Nueva Frase </button>
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