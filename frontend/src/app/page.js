"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import Button from '@/components/Button';
import Input from '@/components/Input';
import Logo from '@/components/Logo';
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
            email: email,
            password: password
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
                } else {
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
        if (password == pass) {
            const newUser = { username: user, password: password, email: email }
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

    // CÓMO JUGAR

    // los pasos del panel "Cómo jugar"
    const pasos = [
        { titulo: "1. Escribí una frase", texto: "Todos escriben una frase que otro jugador va a dibujar." },
        { titulo: "2. Dibujá", texto: "Te llega la frase de otro jugador y tenés que dibujarla." },
        { titulo: "3. Describí el dibujo", texto: "Te llega un dibujo y escribís qué te parece que es." },
        { titulo: "4. Pasá el álbum", texto: "Se va alternando entre dibujar y describir hasta que cada álbum pasa por todos." },
        { titulo: "5. Mirá cómo terminó", texto: "Al final se revelan los álbumes y se ve cómo cambió cada frase." },
    ]

    // qué paso del "Cómo jugar" se está mostrando (0 es el primero)
    const [pasoAyuda, setPasoAyuda] = useState(0)

    const anterior = () => {
        if (pasoAyuda > 0) {
            setPasoAyuda(pasoAyuda - 1)
        }
    }

    const siguiente = () => {
        if (pasoAyuda < pasos.length - 1) {
            setPasoAyuda(pasoAyuda + 1)
        }
    }

    return (
        <main className={styles.pagina}>
            <Logo />
            <div className={styles.contenido}>
                <section>
                    <div className={styles.tabs}>
                        <button className={logreg ? styles.tabActiva : styles.tab} onClick={log}>Iniciar sesión</button>
                        <button className={!logreg ? styles.tabActiva : styles.tab} onClick={reg}>Registrarme</button>
                    </div>
                    <div className={styles.panel}>
                        {logreg ?
                            <>
                                <Input placeholder="Email" value={email} onChange={emailSetter} />
                                <Input type="password" placeholder="Contraseña" value={password} onChange={passwordSetter} />
                                <Button onClick={login} disabled={password === "" || email === ""} txt="Entrar" />
                            </>
                            :
                            <>
                                <Input placeholder="Username" value={user} onChange={userSetter} />
                                <Input type="email" placeholder="Email" value={email} onChange={emailSetter} />
                                <Input type="password" placeholder="Contraseña" value={password} onChange={passwordSetter} />
                                <Input type="password" placeholder="Repetir contraseña" value={pass} onChange={passSetter} />
                                <Button onClick={register} disabled={password === "" || user === "" || email === "" || pass === ""} txt="Registrarse" />
                            </>}
                    </div>
                </section>
                <aside className={styles.ayuda}>
                    <h2 className={styles.ayudaTitulo}>Como jugar</h2>
                    <div className={styles.esquema}>
                        <span>ABC</span>
                        <span className={styles.flechita}>→</span>
                        <span>[ ]</span>
                        <span className={styles.flechita}>→</span>
                        <span>ABC</span>
                    </div>
                    <h3 className={styles.paso}>{pasos[pasoAyuda].titulo}</h3>
                    <p className={styles.descripcion}>{pasos[pasoAyuda].texto}</p>
                    <div className={styles.navegacion}>
                        <button className={styles.flechaIzquierda} onClick={anterior} aria-label="Paso anterior" />
                        <div className={styles.puntos}>
                            {pasos.map((p, i) => (
                                <span key={i} className={i === pasoAyuda ? styles.puntoActivo : styles.punto} />
                            ))}
                        </div>
                        <button className={styles.flechaDerecha} onClick={siguiente} aria-label="Paso siguiente" />
                    </div>
                </aside>
            </div>
        </main>
    )
}