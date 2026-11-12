const MIN_JUGADORES = 2 
const MAX_JUGADORES = 8

let salas = []

const CARACTERES = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

function generarCodigo() {
    let codigo = ""
    for (let i = 0; i < 5; i++) {
        codigo += CARACTERES[Math.floor(Math.random() * CARACTERES.length)]
    }
    return codigo
}

function crearSala(datos) {
    console.log("datos crear sala",datos)
    let codigo = generarCodigo()
    let contador = 0;
    let endWhile = false;
    console.log(codigo)

    //PROBABLEMENTE MAL
    do {
        if (salas[contador] == undefined) {
            endWhile = true;
        } else if ( (salas[contador]).codigo.trim().toUpperCase() == codigo.trim().toUpperCase()) {
            codigo = generarCodigo()
            endWhile = true;
        }
        contador++;
    } while(contador < salas.length && !endWhile)
    
    let sala = { codigo: codigo, anfitrion: datos.id, estado: "esperando", jugadores: [], expulsados: [] }
    console.log("LA SALA ES:",sala)
    salas.push(sala)
    return codigo
}

function buscarSala(codigo) {
    salas.map(s => {
        if (s.codigo.trim().toUpperCase() === codigo.trim().toUpperCase()) {
            console.log("probando sala",s.codigo.trim().toUpperCase())
            return s.codigo.trim().toUpperCase()
        }
    })
}

// devuelve "" si el usuario puede entrar a la sala, o el motivo por el que no puede
function motivoDeRechazo(sala, usuario) {
    if (!sala) {
        return "La sala no existe"
    }
    if (sala.expulsados.includes(usuario.id)) {
        return "Te expulsaron de esta sala"
    }
    // puede volver a entrar si ya estaba adentro
    if (sala.jugadores.some((j) => j.id === usuario.id)) {
        return ""
    }
    if (sala.estado !== "esperando") {
        return "La partida ya empezó"
    }
    if (sala.jugadores.length >= MAX_JUGADORES) {
        return "La sala está llena"
    }
    return ""
}

//si el jugador ya estaba solo actualiza su socketId (se reconectó)
function agregarJugador(sala, data, socketId) {
    console.log("datos agregar",data)
    const existente = sala.jugadores.find((j) => j.id === data.id) 
    console.log("existente",existente)
    if (existente) {
        existente.socketId = socketId
    } else {
        sala.jugadores.push({ id: data.id, username: data.usuario, socketId })
    }
}

// Si el jugador al que se saca era el anfitrión, pasa al que sigue, y si no queda nadie borra la sala
function quitarJugador(sala, idUsuario) {
    sala.jugadores = sala.jugadores.filter((j) => j.id !== idUsuario)
    if (sala.jugadores.length === 0) {
        delete salas[sala.codigo]
    } else if (sala.anfitrion === idUsuario) {
        sala.anfitrion = sala.jugadores[0].id
    }
}

// esto es lo que que se le manda al front 
function datosSala(sala) {
    return {
        codigo: sala.codigo,
        anfitrion: sala.anfitrion,
        estado: sala.estado,
        minimo: MIN_JUGADORES,
        maximo: MAX_JUGADORES,
        jugadores: sala.jugadores.map((j) => ({ id: j.id, username: j.username })),
    }
}

module.exports = {
    MIN_JUGADORES,
    MAX_JUGADORES,
    crearSala,
    buscarSala,
    motivoDeRechazo,
    agregarJugador,
    quitarJugador,
    datosSala,
}