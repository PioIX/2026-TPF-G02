"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import Button from '@/components/Button';
import Input from '@/components/Input';

export default function Authentication() {

    // AUTHENTICATION

    const [logreg, setlogreg] = useState(true)

    const log = () => {
        setlogreg(true)
        setUser("")
        setPassword("")
        setEmail("")
        setPass("")
    }
    
    const reg = () => {
        setlogreg(false)
        setUser("")
        setPassword("")
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
        fetch(`http://localhost:4000/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        })
        res => {res.json(),// hacer lo que sea que Claude quiere que haga con ok:true
            router.replace("http://localhost:3000/home")}
        data => console.log("actualizado", data)// hacer lo que sea que Claude quiere que haga con ok:false

        .then((res) => res.json())
        .then((data) => {
            if (data.ok) {
                localStorage.setItem("usuario", JSON.stringify(data.usuario))
                if (data.usuario.admin) {
                    router.replace("http://localhost:3000/admin")
                } else {
                    router.replace("http://localhost:3000/menu")
                }
            }else{
                alert(data.mensaje)
                return
            }
        })
    }

    // REGISTER

    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")

    const emailSetter = (event) => {
        setEmail(event.target.value)
    }

    const passSetter = (event) => {
        setPass(event.target.value)
    }

    const register = () => {
        if (password==pass) {
            const newUser = {username:user, password:password, email:email}
            fetch(`http://localhost:4000/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser)
            })
            res => res.json()// hacer lo que sea que Claude quiere que haga con ok:true
            data => console.log("actualizado", data)// hacer lo que sea que Claude quiere que haga con ok:false
            
            .then((res) => res.json())
            .then((data) => {
            if (!data.ok) {
                alert(data.mensaje)
                return
            }})
            setlogreg(true)
        } else {
            alert("La contraseña no coincide con su repetición")
            return
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
                    <Input type="password" placeholder="Contraseña" onChange={passwordSetter}></Input>
                    <Button onClick={login} disabled={password === "" || user === ""} txt="Entrar"></Button>
                    </>
                    :
                    <>
                    <Input placeholder="Username" onChange={userSetter}></Input>
                    <Input type="email" placeholder="Email" onChange={emailSetter}></Input>
                    <Input type="password" placeholder="Contraseña" onChange={passwordSetter}></Input>
                    <Input type="password" placeholder="Repetir contraseña" onChange={passSetter}></Input>
                    <Button onClick={register} disabled={password === "" || user ==="" || email ==="" || pass ===""} txt="Registrarse"></Button>
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