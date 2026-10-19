"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Home() {

    // LOGREG

    let logreg = true
    
    function log() {
        logreg=true
    }

    function reg() {
        logreg=false
    }

    // LOGIN

    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()
    
    let validUser=false
    let validPass=false
    
    const userSetter = (event) => {
        setUser(event.target.value)
        validUser=false
    }

    const passwordSetter = (event) => {
        setPassword(event.target.value)
        validPass=false
    }

    const login = () => {
        fetch("http://localhost:4000/nose")//cambiar ruta user
        response => response.json()
        for (let i = 0; i < data.length; i++) {
            if (user==data.user) {
                validUser=true
            }
        }
        fetch("http://localhost:4000/nose")//cambiar ruta password
        response => response.json()
        for (let i = 0; i < data.length; i++) {
            if (password==data.password) {
                validPass=true
            }
        }
        if (validUser==true&validPass==true) {
            router.replace(`http://localhost:3000/menu`)
            localStorage.setItem("miClave", user)
        }
    }

    // REGISTER

    
    return(
        <>
        <div>
            <Button onClick={log} txt="Iniciar sesión"></Button>
            <Button onClick={reg} txt="Registrarme"></Button>
            <div>
                {logreg ?
                <>
                <Input placeholder="Username" onChange={userSetter}></Input>
                <Input placeholder="Contraseña" onChange={passwordSetter}></Input>
                <Button onClick={login} disabled={password != "" & user!=""} txt="Entrar"></Button>
                </>
                :
                <>
                <Input placeholder="Username"></Input>
                <Input placeholder="Email"></Input>
                <Input placeholder="Contraseña"></Input>
                <Input placeholder="Repetir contraseña"></Input>
                <Button onClick={login} disabled={password != "" & user!=""} txt="Registrarse"></Button>
                </>}
            </div>
        </div>
        <div>
            <h2>Como jugar</h2>
            <img src=""></img>
            <p>Todos escriben una frase que otro jugador va a dibujar</p>
        </div>
        </>
    )
}