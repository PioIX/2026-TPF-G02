"use client"
import styles from "./admin.module.css"
import EditFrases from "@/components/EditFrases"
import Moderacion from "@/components/Moderacion"
import UsuariosAdmin from "@/components/UsuariosAdmin"
import { useSearchParams } from "next/navigation"
import { useState,useEffect } from "react"
import { useRouter } from "next/navigation";

export default function Admin() {
    const router = useRouter()
    const searchParams = useSearchParams()
    // Variables para controlar datos de lo que viene -\(¨)/-
    const [frases,setFrases] = useState([])
    const [moderacion,setModeracion] = useState([])
    const [usuarios,setUsuarios] = useState([])
    const [datos,setDatos] = useState({})
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
            .then(data => {
                if(data.ok){
                    console.log(data)
                    setFrases(data.frases);
                }else{
                    console.log(data.mensaje)
                }});
            fetch("http://localhost:4000/admin/pasos")
            .then(response => response.json())
            .then(data => {
                if(data.ok){
                  setModeracion(data.pasos || [])
                }else{
                    console.log(data.mensaje)
                }
            });
            fetch("http://localhost:4000/admin/usuarios")
            .then(response => response.json())
            .then(data => {
                if(data.ok){
                    setUsuarios(data.usuarios || []);
                }else{
                    console.log(data.mensaje)
                }
            })
        },[update])
    // Funcion para agregar frase
    const nueva = () =>{
        console.log("nueva")
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
        console.log("edit")
        let nuevo = window.prompt("Ingrese la nueva frase")
        const datubi = {
            id: id,
            frase: nuevo
        }
        fetch(`http://localhost:4000/admin/frases`, { 
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datubi)
    })
        .then(response => response.json())
        .then(data => {console.log("actualizado", data),
            recargar()
        });
    }
    const borrarFrase = (id) => {
        console.log("borrar")
        const datubi = {
                id:id
        }
        fetch(`http://localhost:4000/admin/frases`, { 
        method: 'DELETE'
        })
        .then(response => response.json())
        .then(recargar())
    }
    const borrarStep = (id) => {
        console.log("borrarStep")
        const datubi = {
            id:id
        }
        fetch(`http://localhost:4000/admin/pasos`, { 
        method: 'DELETE'
        })
        .then(response => response.json)
        .then(recargar())
    }
    const bloqDes = (id,blocked) => {
        console.log("bloquear/des")
        const datubi ={
            id:id,
            blocked:!blocked
        }
        fetch(`http://localhost:4000/admin/usuarios/bloqueo`, { 
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datubi)
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
                <button className={styles.nueva} onClick={nueva}> 
                    <span className={styles.mas} /> Nueva frase 
                    </button>
                    {frases.map((est) => (
                        <EditFrases
                         key={est.id}
                         id = {est.id}  
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
                <p className={styles.sub} >Contenido de las partidas. Borra lo inapropiado.</p>
                {moderacion.map((est) => ( 
                        <Moderacion
                            key={est.id}
                            id = {est.id}
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
                {usuarios.map((est) => (
                    <UsuariosAdmin
                        key={est.id}
                        id = {est.id}
                        usuario={est.username}
                        email={est.email}
                        bloqueado={est.blocked}
                        control={() => bloqDes(est.id,est.blocked)}
                    />))
                    
                }
                <UsuariosAdmin // Prueba de componente
                    usuario={"Juan"}
                    email={"juankeke67"}
                    bloqueado={0}
                    control={() => bloqDes(est.id)}
                />
            </div>);
            /*<p>Todo bien con Usuarios</p>);*/
    }
    return(
        < div className={styles.pagina}>
            <header className={styles.header}>
                <button className={styles.volver} onClick={() => router.back()}>
                    <span className={styles.flecha} />
                    Volver
                </button>
            </header>
            <h1>Panel de administrador</h1>
            <button className={styles.tab} onClick={() => setOption(1)}>Frases</button>
            <button className={styles.tab} onClick={() => setOption(2)}>Moderación</button>
            <button className={styles.tab} onClick={() => setOption(3)}>Usuarios</button>
            <section className={styles.panel}>
                {
                    reenderizar()
                }
            </section>
        </div>
    )
}