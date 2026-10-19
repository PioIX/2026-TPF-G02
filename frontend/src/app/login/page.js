"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Home() {
  const [user, setUser] = useState("")
  const [password, setPassword] = useState("")
  const [room, setRoom] = useState("")
  const router = useRouter()
  
  let validUser=false
  let validRoom=false
  let validPass=false
  
  const userSetter = (event) => {
    setUser(event.target.value)
    validUser=false
  }
  
  const roomSetter = (event) => {
    setRoom(event.target.value)
    validPass=false
  }

  const passwordSetter = (event) => {
    setPassword(event.target.value)
    validRoom=false
  }

  const login = () => {
    fetch("http://localhost:4000/nose")//cambiar ruta user
    response => response.json()
    for (let i = 0; i < data.length; i++) {
      if (user==data.user) {
        return(validUser=true)
      }
    }
    fetch("http://localhost:4000/nose")//cambiar ruta password
    response => response.json()
    for (let i = 0; i < data.length; i++) {
      if (password==data.password) {
        return(validPass=true)
      }
    }
    fetch("http://localhost:4000/nose")//cambiar ruta room
    response => response.json()
    for (let i = 0; i < data.length; i++) {
      if (room==data.room) {
        return(validRoom=true)
      }
    }
    if (validUser==true&validPass==true&validRoom==true) {
      router.replace(`http://localhost:3000/?room=${room}&user=${user}`)  
    }
    
  }

  const register = () => {
    router.replace(`http://localhost:3000/register`)
  }

  return(<>
    <input onChange={userSetter} placeholder="Username"></input>
    <input onChange={passwordSetter} placeholder="Password"></input>
    <input onChange={roomSetter} placeholder="Codigo de la partida"></input>
    <button onClick={login} disabled={password != "" & user!="" & room!=""}>Unirse a partida</button>
    <button onClick={register}></button>
  </>)
}