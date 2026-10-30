const MAX_TEXTO = 200
const MAX_DIBUJO = 900000 // Socket.IO acepta mensajes de hasta 1 MB

// qué hay que hacer en cada ronda
function tipoDeRonda(ronda) {
    if (ronda === 0) {
        return "frase"
    }
    if (ronda % 2 === 1) {
        return "dibujo"
    }
    return "descripcion"
}

// se llama cuando el anfitrión inicia la partida
function crearPartida(sala) {
    const ids = sala.jugadores.map((j) => j.id)
    sala.partida = {
        ronda: 0,
        totalRondas: ids.length,
        jugadores: ids,
        albumes: ids.map((id) => ({ idDueno: id, pasos: [] })),
        enviaron: [],
    }
}

// número del álbum que le toca a un jugador en la ronda actual
function albumDeJugador(partida, idJugador) {
    const posicion = partida.jugadores.indexOf(idJugador)
    const cantidad = partida.jugadores.length
    return (posicion - partida.ronda + cantidad) % cantidad
}

// recibido: el paso anterior del álbum que le tocó: { esTexto, contenido } (en la ronda 0 es null)
// enviado: true si ya mandó su paso de esta ronda (sirve si recarga la página)
function tareaDeRonda(sala, idJugador) {
    const partida = sala.partida
    let recibido = null
    if (partida.ronda > 0) {
        const album = partida.albumes[albumDeJugador(partida, idJugador)]
        const pasoAnterior = album.pasos[partida.ronda - 1]
        if (pasoAnterior) {
            recibido = { esTexto: pasoAnterior.esTexto, contenido: pasoAnterior.contenido }
        }
    }
    return {
        ronda: partida.ronda,
        totalRondas: partida.totalRondas,
        tipo: tipoDeRonda(partida.ronda),
        recibido,
        enviado: partida.enviaron.includes(idJugador),
    }
}

// guarda lo que mandó el jugador en el álbum que le tocaba
// devuelve "" si salió bien, o el motivo por el que no se pudo guardar
function guardarPaso(sala, idJugador, contenido) {
    const partida = sala.partida
    if (!partida.jugadores.includes(idJugador)) {
        return "No estás jugando esta partida"
    }
    if (partida.enviaron.includes(idJugador)) {
        return "Ya enviaste tu paso de esta ronda"
    }
 
    // frase y descripción son texto; el dibujo es una URL (la imagen escrita como texto)
    const esTexto = tipoDeRonda(partida.ronda) !== "dibujo"
    let guardar = contenido
    if (esTexto) {
        guardar = String(contenido || "").trim()
        if (guardar === "" || guardar.length > MAX_TEXTO) {
            return `El texto tiene que tener entre 1 y ${MAX_TEXTO} letras`
        }
    } else if (typeof contenido !== "string" || !contenido.startsWith("data:image/") || contenido.length > MAX_DIBUJO) {
        return "El dibujo no es válido"
    }
 
    const album = partida.albumes[albumDeJugador(partida, idJugador)]
    album.pasos[partida.ronda] = { idAutor: idJugador, esTexto, contenido: guardar }
    partida.enviaron.push(idJugador)
    return ""
}

module.exports = {
    crearPartida,
    tareaDeRonda,
    guardarPaso,
}