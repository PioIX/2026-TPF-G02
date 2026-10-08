"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Home() {
  const [user, setUser] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")

  let passbien=false
  let userbien=false

  const userSetter = (event) => {
    setUser(event.target.value)
    //fetch para ver que user no este en uso; en ese caso:userbien=true
  }
  
  const emailSetter = (event) => {
    setEmail(event.target.value)
  }

  const passwordSetter = (event) => {
    setPassword(event.target.value)
  }

  const passSetter = (event) => {
    setPass(event.target.value)
  }

  const handleRegister = () => {
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
    if (passbien&userbien) {
      const newUser = {user:user, password:password, email:email}
      fetch(`http://localhost:4000/nose`, {//cambiar ruta
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      })
      response => response.json()
      data => console.log("actualizado", data)
    
      router.replace(`http://localhost:3000/login`)  
    }
    
  }

  return(<>
    <h1>Crear Cuenta</h1>
    <input onChange={userSetter} placeholder="Nombre de usuario"></input>
    <input onChange={emailSetter} placeholder="Email"></input>
    <input onChange={passwordSetter} placeholder="contraseña"></input>
    <input onChange={passSetter} placeholder="Repetir contraseña"></input>
    ESTOS VAN DE A DOS (CSS LO HACE)
    <p>Ya tenes cuenta?:</p>
    <button onClick={login}>Logearse</button>
    ESTOS VAN DE A DOS (CSS LO HACE)
    <button onClick={handleRegister}>Registrarme</button>
  </>)
}