"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import Button from '@/components/Button';
import Input from '@/components/Input';
import styles from "./page.module.css"
export default function Home() {

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
        setEmail("")
        setPass("")
    }

    // LOGIN

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()
    
    const userSetter = (event) => {
        setUser(event.target.value)
    }

    const passwordSetter = (event) => {
        setPassword(event.target.value)
    }

    const login = () => {
        const verif = {
            email:email,
            password:password
        }
        fetch(`http://localhost:4000/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(verif)
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.ok) {
                localStorage.setItem("usuario", JSON.stringify(data.usuario))
                if (data.usuario.admin) {
                   router.push("/admin")
                } else {
                    router.push(`/menu?`)
                }
            }else{
                alert(data.mensaje)
                return
            }
        })
    }

    // REGISTER
    
    const [user, setUser] = useState("")
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
            .then((res) => res.json())
            .then((data) => {
            if (!data.ok) {
                console.log("actualizado", data)
                alert(data.mensaje)
                router.refresh()
                return
            }
            log()
            alert("Cuenta registrada")
            })
        } else {
            alert("La contraseña no coincide con su repetición")
            router.refresh()
            return
        }
    }
    
    return(
        <main className={styles.pagina}>
            <div className={styles.contenido}>
                    <section>
                    <div className={styles.tabs}>
                        <Button onClick={log} txt="Iniciar sesión"/>
                        <Button onClick={reg} txt="Registrarme"/>
                    </div>
                    <div className={styles.panel}>
                        {logreg ?
                        <>
                        <Input placeholder="Email" value={email} onChange={emailSetter}/>
                        <Input type="password" placeholder="Contraseña" value={password} onChange={passwordSetter}/>
                        <Button onClick={login} disabled={password === "" || email === ""} txt="Entrar"/>
                        </>
                        :
                        <>
                        <Input placeholder="Username" value={user} onChange={userSetter}/>
                        <Input type="email" placeholder="Email" value={email} onChange={emailSetter}/>
                        <Input type="password" placeholder="Contraseña" value={password} onChange={passwordSetter}/>
                        <Input type="password" placeholder="Repetir contraseña" value={pass} onChange={passSetter}/>
                        <Button onClick={register} disabled={password === "" || user ==="" || email ==="" || pass ===""} txt="Registrarse"/>
                        </>}
                    </div>
                </section>
                <aside className={styles.ayuda}>
                    <h2 className={styles.ayudaTitulo}>Como jugar</h2>
                    <img alt="lorem"></img>
                    <h3 className={styles.paso}>1. Escribí una frase</h3>
                    <p className={styles.descripcion}>Todos escriben una frase que otro jugador va a dibujar</p>
                </aside>
            </div>
        </main>
    )
}