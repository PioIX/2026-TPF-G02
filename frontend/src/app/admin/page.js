"use client"
import EditFrases from "@/components/EditFrases"
import Moderacion from "@/components/Moderacion"
import UsuariosAdmin from "@/components/UsuariosAdmin"
import { useSearchParams } from "next/navigation"
import { useState,useEffect } from "react"

export default function Admin() {
    const searchParams = useSearchParams()
    // Variables para controlar datos de lo que viene -\(¨)/-
    const [frases,setFrases] = useState([])
    const [moderacion,setModeracion] = useState([])
    const [usuarios,setUsuarios] = useState([])
    const [datos,setDatos] = useState()
    // Variable para las opciones de lo que se muestra en el div de abajo
    const [option,setOption] = useState(0)
    // Controlador de actualizacion para los nuevos datos
    const [update,setUpdate] = useState((true))
    //Recibir datos de la URL
    const user = searchParams.get("user")
    const recargar = () => setUpdate(prev => !prev)
    // Traer datos
        useEffect(() => {
            fetch("http://localhost:4000/admin/frases")
            .then(response => response.json())
            .then(data => {setFrases(data.frases || []);});
            fetch("http://localhost:4000/admin/pasos")
            .then(response => response.json())
            .then(data => {setModeracion(data.pasos || [])});
            fetch("http://localhost:4000/admin/usuarios")
            .then(response => response.json())
            .then(data => {setUsuarios(data.usuarios || []);
        },[update])})
    // Funcion para agregar frase
    const nueva = () =>{
        let nuevo = window.prompt("Ingrese la nueva frase")
        setDatos({
        frase: nuevo
        })
         fetch("http://localhost:4000/admin/frases", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        })
            .then(response => response.json())
            .then(data => {setFrases([...frases, data]),
                recargar()
            });
            }


    // Funciones para los botones de editar frases
    const edit = (id) => {
        let nuevo = window.prompt("Ingrese la nueva frase")
        setDatos({
            id: id,
            frase: nuevo
        })
        fetch(`http://localhost:4000/admin/frases`, { //completar con put correcto
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
    })
        .then(response => response.json())
        .then(data => {console.log("actualizado", data),
            recargar()
        });
    }
    const borrarFrase = (id) => {
        setDatos({
                id:id
        })
        fetch(`http://localhost:4000/admin/frases`, { //completar con delete correcto
        method: 'DELETE'
        })
        .then(response => response.json())
        .then(() => recargar())
    }
    const borrarStep = (id) => {
        setDatos({
            id:id
        })        
        fetch(`http://localhost:4000/admin/pasos`, { //completar con delete correcto
        method: 'DELETE'
        })
        .then(response => response.json)
        .then(() => recargar())
    }
    const bloqDes = (id) => {
        setDatos({
            id:id
        })        
        fetch(`http://localhost:4000/admin/usuarios/bloqueo`, { //completar con put correcto
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
    })
        .then(response => response.json())
        .then(data => {console.log("actualizado", data),
            recargar()
        });
    }
    // Reenderizado
    const reenderizar = () =>{
        if (option === 0) return <p>Seleccione una opción</p>;
        if (option === 1) return(
            <div>
                <button onClick={() => nueva()}> + Nueva Frase </button>
                    {frases.map((est,index) => (
                        <EditFrases
                         key={index}
                         frase={est.frase}
                         edit={() => edit(est.id)}
                         borrar={() => borrarFrase(est.id)}
                        />
                    ))}
                    <EditFrases // Prueba de componente
                        frase={"Fortnite prime"}
                        edit={() => edit(est.id)}
                        borrar={() => borrarFrase(est.id)}
                    />
                </div>);
                /*<p>Todo bien acá en frases </p>);*/
        if (option === 2) return(
            <div>
                <p>Contenido de las partidas. Borra lo inapropiado.</p>
                {moderacion.map((est,index) => ( 
                        <Moderacion
                            key={index}
                            nombre={est.autor}
                            tipo={est.is_text}
                            data = {est.content}
                            borrar={() => borrarStep(est.id)}
                        />
                    ))
                }
                <Moderacion // Prueba de componente
                    nombre={"Juan"}
                    tipo={1}
                    data={"chau"}
                    borrar={() => borrarStep(id)}                    
                />
            </div>);
            /*<p>Todo bien acá en Moderación</p>);*/
        if (option === 3) return( 
            <div>
                {usuarios.map((est,index) => (
                    <UsuariosAdmin
                        key={index}
                        usuario={est.username}
                        email={est.email}
                        bloqueado={est.bloked}
                        control={() => bloqDes(est.id)}
                    />))
                    
                }
                <UsuariosAdmin // Prueba de componente
                    usuario={"Juan"}
                    email={"juankeke67"}
                    bloqueado={1}
                    control={() => bloqDes(est.id)}
                />
            </div>);
            /*<p>Todo bien con Usuarios</p>);*/
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