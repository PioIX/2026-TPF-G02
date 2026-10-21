// Tarea 7: frases sugeridas, moderación de pasos y bloqueo de usuarios.
const express = require("express")
const { realizarQuery } = require("./mysql")
const { soloLogueado } = require("./permisos")

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

