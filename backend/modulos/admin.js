// Tarea 7: frases sugeridas, moderación de pasos y bloqueo de usuarios.
const express = require("express")
const { realizarQuery } = require("./mysql")
const { soloLogueado } = require("./admin")

const publico = express.Router()
const admin = express.Router()

const MAX_FRASE = 200
const PASOS_POR_PAGINA = 10

// Esto es para no repetir siempre el try/catch en cada ruta
function segura(manejador) {
    return async (req, res) => {
        try {
            await manejador(req, res)
        } catch (error) {
            console.error(error)
            res.status(500).json({ ok: false, mensaje: "Error del servidor" })
        }
    }
}

function textoValido(texto) {
    return typeof texto === "string" && texto.trim().length > 0 && texto.trim().length <= MAX_FRASE
}

/*  Esto es para obtener las frases al azar (GET /frases/azar)*/
publico.get("/azar", soloLogueado, segura(async (req, res) => {
    const frases = await realizarQuery("SELECT id, frase AS texto FROM SuggestedFrases ORDER BY RAND() LIMIT 1")
    if (frases.length === 0) {
        return res.status(404).json({ ok: false, mensaje: "Todavía no hay frases cargadas" })
    }
    res.json({ ok: true, frase: frases[0] })
}))

/* A partir de aca se trabaja con las frases sugeridas */
// lo de "frase AS texto" es para que, aunque en la base la columna se llama frase, al front le llega como "texto"

admin.get("/frases", segura(async (req, res) => {
    const frases = await realizarQuery("SELECT id, frase AS texto FROM SuggestedFrases ORDER BY id DESC")
    res.json({ ok: true, frases })
}))

admin.post("/frases", segura(async (req, res) => {
    if (!textoValido(req.body.texto)) {
        return res.status(400).json({ ok: false, mensaje: `La frase tiene que tener entre 1 y ${MAX_FRASE} letras` })
    }
    const texto = req.body.texto.trim()
    const resultado = await realizarQuery("INSERT INTO SuggestedFrases (frase) VALUES (?)", [texto])
    res.status(201).json({ ok: true, frase: { id: resultado.insertId, texto } })
}))

admin.put("/frases/:id", segura(async (req, res) => {
    const id = Number(req.params.id)
    if (!textoValido(req.body.texto)) {
        return res.status(400).json({ ok: false, mensaje: `La frase tiene que tener entre 1 y ${MAX_FRASE} letras` })
    }
    const texto = req.body.texto.trim()
    const existe = await realizarQuery("SELECT id FROM SuggestedFrases WHERE id = ?", [id])
    if (existe.length === 0) {
        return res.status(404).json({ ok: false, mensaje: "La frase no existe" })
    }
    await realizarQuery("UPDATE SuggestedFrases SET frase = ? WHERE id = ?", [texto, id])
    res.json({ ok: true, frase: { id, texto } })
}))

admin.delete("/frases/:id", segura(async (req, res) => {
    const id = Number(req.params.id)
    const existe = await realizarQuery("SELECT id FROM SuggestedFrases WHERE id = ?", [id])
    if (existe.length === 0) {
        return res.status(404).json({ ok: false, mensaje: "La frase no existe" })
    }
    await realizarQuery("DELETE FROM SuggestedFrases WHERE id = ?", [id])
    res.json({ ok: true })
}))

/* A partir de aca se trabaja con la moderación (ver y eliminar pasos) */
 
admin.get("/pasos", segura(async (req, res) => {
    const pagina = Math.max(parseInt(req.query.pagina) || 1, 1)
    const desde = (pagina - 1) * PASOS_POR_PAGINA
    const tipo = req.query.tipo
 
    let donde = ""
    let datos = [PASOS_POR_PAGINA, desde]
    if (tipo === "texto" || tipo === "dibujo") {
        donde = "WHERE s.is_text = ?"
        datos = [tipo === "texto" ? 1 : 0, PASOS_POR_PAGINA, desde]
    }
    
    // "content" es la imagen (texto muy largo), por eso son pocos por página
    // "dueno" es el dueño del álbum. Cuando se agregue user_id (autor) a Steps, hay que unirlo con Users por s.user_id
    const pasos = await realizarQuery(
        `SELECT s.id, s.is_text, s.content, s.\`order\` AS orden, u.username AS dueno, g.roomcode
        FROM Steps s
        INNER JOIN Albums a ON a.id = s.album_id
        INNER JOIN Users u ON u.id = a.user_id
        INNER JOIN Games g ON g.id = a.game_id
        ${donde}
        ORDER BY s.id DESC
        LIMIT ? OFFSET ?`,
        datos   
    )
    res.json({ ok: true, pagina, pasos })
}))
 
// Esto borra el paso inapropiado
admin.delete("/pasos/:id", segura(async (req, res) => {
    const id = Number(req.params.id)
    const existe = await realizarQuery("SELECT id FROM Steps WHERE id = ?", [id])
    if (existe.length === 0) {
        return res.status(404).json({ ok: false, mensaje: "El paso no existe" })
    }
    await realizarQuery("DELETE FROM Steps WHERE id = ?", [id])
    res.json({ ok: true })
}))

/* A partir de aca se trabaja con la parte de usuarios (ver la lista, bloquear y desbloquear) */
 admin.get("/usuarios", segura(async (req, res) => {
    const usuarios = await realizarQuery("SELECT id, username, email, admin, blocked FROM Users ORDER BY username")
    res.json({ ok: true, usuarios })
}))
 
admin.put("/usuarios/:id/bloqueo", segura(async (req, res) => {
    const id = Number(req.params.id)
    const blocked = req.body.blocked === true ? 1 : 0
 
    if (id === req.session.user.id) {
        return res.status(400).json({ ok: false, mensaje: "No podés bloquearte a vos mismo" })
    }
 
    const usuarios = await realizarQuery("SELECT id, admin FROM Users WHERE id = ?", [id])
    if (usuarios.length === 0) {
        return res.status(404).json({ ok: false, mensaje: "El usuario no existe" })
    }
    if (usuarios[0].admin) {
        return res.status(400).json({ ok: false, mensaje: "No se puede bloquear a un administrador" })
    }
 
    await realizarQuery("UPDATE Users SET blocked = ? WHERE id = ?", [blocked, id])
    res.json({ ok: true, blocked: blocked === 1 })
}))
 
module.exports = { publico, admin }