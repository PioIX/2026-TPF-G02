const MIN_JUGADORES = 2 
const MAX_JUGADORES = 8

const salas = {}

const CARACTERES = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

function generarCodigo() {
    let codigo = ""
    for (let i = 0; i < 5; i++) {
        codigo += CARACTERES[Math.floor(Math.random() * CARACTERES.length)]
    }
    return codigo
}

function crearSala(usuario) {
    let codigo = generarCodigo()
    while (salas[codigo]) {
        codigo = generarCodigo() // si el código ya existe, se prueba con otro
    }
    salas[codigo] = { codigo, anfitrion: usuario.id, estado: "esperando", jugadores: [], expulsados: [] }
    return codigo
}

function buscarSala(codigo) {
    return salas[String(codigo || "").trim().toUpperCase()]
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
function agregarJugador(sala, usuario, socketId) {
    const existente = sala.jugadores.find((j) => j.id === usuario.id)
    if (existente) {
        existente.socketId = socketId
    } else {
        sala.jugadores.push({ id: usuario.id, username: usuario.username, socketId })
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