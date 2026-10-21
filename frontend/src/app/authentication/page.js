"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Home() {

    // AUTHENTICATION

    let logreg = true
    
    function log() {
        logreg=true
        setUser("")
        setPassword("")
    }

    function reg() {
        logreg=false
        setUser("")
        setPassword("")
    }

    // LOGIN

    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()
    
    let validUser=false
    let validPass=false
    let admin=false
    
    const userSetter = (event) => {
        setUser(event.target.value)
        validUser=false
    }

    const passwordSetter = (event) => {
        setPassword(event.target.value)
        validPass=false
    }

    const login = () => {
        fetch("http://localhost:4000/nose")//cambiar ruta user & password
        response => response.json()
        for (let i = 0; i < data.length; i++) {
            if (user==data.user) {
                validUser=true
                if (validUser) {
                    if (data.admin==1) {
                        admin=true
                    }
                    if (password==data.password) {
                        validPass=true    
                    }
                }
            }
        }
        if (validUser & validPass & !admin) {
            router.replace(`http://localhost:3000/menu`)
            localStorage.setItem("user", user)
        }
        if (validUser & validPass & admin) {
            router.replace(`http://localhost:3000/admin?user=${user}`)
            localStorage.setItem("user", user)
        }
        if (!validUser) {
            return(alert("Usuario inexistente"))
        } else {
            return(alert("Contraseña incorrecta"))
        }
    }

    // REGISTER

    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")

    let passbien=false
    let userbien=false

    const emailSetter = (event) => {
        setEmail(event.target.value)
    }

    const passSetter = (event) => {
        setPass(event.target.value)
    }

    const register = () => {
        fetch("http://localhost:4000/nose")//cambiar ruta user
        response => response.json()
        for (let i = 0; i < data.length; i++) {
            if (user==data.user) {
                return(userbien=false)
            } else {
                return(userbien=true)
            }
        }
        if (password==pass) {
            passbien=true
        }
        if (passbien & userbien) {
        const newUser = {user:user, password:password, email:email}
        fetch(`http://localhost:4000/nose`, {//cambiar ruta
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        })
        response => response.json()
        data => console.log("actualizado", data)
        
        logreg = true  
        } else {
            if (!passbien) {
                return(alert("La contraseña no coincide con su repetición")    )
            } else {
                return(alert("El nombre de usuario ya esta en uso"))
            }
        }
    }
    
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
                <Input placeholder="Username" onChange={userSetter}></Input>
                <Input placeholder="Email" onChange={emailSetter}></Input>
                <Input placeholder="Contraseña" onChange={passwordSetter}></Input>
                <Input placeholder="Repetir contraseña" onChange={passSetter}></Input>
                <Button onClick={register} disabled={password != "" & user!="" & email!="" & pass!=""} txt="Registrarse"></Button>
                </>}
            </div>
        </div>
        <div>
            <h2>Como jugar</h2>
            <img src="" alt="lorem"></img>
            <p>Todos escriben una frase que otro jugador va a dibujar</p>
        </div>
        </>
    )
}