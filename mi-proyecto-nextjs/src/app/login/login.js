"use client"

import { useState } from "react"

export default function Home() {
  const [user, setUser] = useState("")
  const [password, setPassword] = useState("")
  const [room, setRoom] = useState("")

   
  let validUser=false
  let validRoom=false
  let validpass=false



  const userSetter = (event) => {
    setUser(event.target.value)
    if (user!="") {
      validUser=true
    }
  }
  
  const roomSetter = (event) => {
    setRoom(event.target.value)
    // fetch
    for (let i = 0; i < array.length; i++) {
      //revisar data
      if (room==data.roomCode) {
        validRoom=false
      }      
    }
  }

  const passwordSetter = (event) => {
    setPassword(event.target.value)
    //fetch
    if (password==data.password) {
      validpass=true
    } else {
      //emitear error "Contraseña incorrecta"
    }
  }

  const login = () => {
    fetch("http://localhost:4000/nose")//cambiar ruta
      .then(response => response.json())
    /*if () {
      validar user existente
    }*/
    router.push(`http://localhost:3000/?room=${room}&user=${user}`)
  }

  const register = () => {
    router.push(`http://localhost:3000/register`)
  }

  return(<>
    <input onChange={userSetter} placeholder="Username"></input>
    <input onChange={passwordSetter} placeholder="Password"></input>
    <input onChange={roomSetter} placeholder="Codigo de la partida"></input>
    <button onClick={login} disabled={password != ""}>Unirse a partida</button>
    <button onClick={register}></button>
  </>)
}