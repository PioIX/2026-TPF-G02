"use client"

export default function Home() {
  const [user, setUser] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")

  let passbien=false

  const handleRegister = () => {//cambiar ruta
    const newUser = {user:user, password:password, email:email}
    fetch(`http://localhost:4000/nose`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    })
    .then(response => response.json())
    .then(data => console.log("actualizado", data))
    
    router.replace(`http://localhost:3000/login?user=${user}`)
  }

  const userSetter = (event) => {
    setUser(event.target.value)
    //fetch para ver que user no este en uso; en ese caso:userbien=true
  }
  
  const emailSetter = (event) => {
    setemail(event.target.value)
  }

  const passwordSetter = (event) => {
    setPassword(event.target.value)
  }

  const pass = (event) => {
    if (event.target.value==password) {
      passbien=true
    }
  }

  return(<>
    <h1>Crear Cuenta</h1>
    <input onChange={userSetter} placeholder="Nombre de usuario"></input>
    <input onChange={emailSetter} placeholder="Email"></input>
    <input onChange={passwordSetter} placeholder="contraseña"></input>
    <input onChange={pass} placeholder="Repetir contraseña"></input>
    ESTOS VAN DE A DOS (CSS LO HACE)
    <p>Ya tenes cuenta?:</p>
    <button onClick={login}>Logearse</button>
    ESTOS VAN DE A DOS (CSS LO HACE)
    <button onClick={handleRegister} disabled={passbien&userbien}>Registrarme</button>
  </>)
}