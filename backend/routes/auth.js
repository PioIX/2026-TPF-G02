// Tarea 6: registro, login y cierre de sesión
const express = require("express")
const { realizarQuery } = require("../modulos/mysql")

const router = express.Router()

function errorServidor(res, error) {
    console.error(error)
    res.status(500).json({ ok: false, mensaje: "Error del servidor" })
}

// esto crea un usuario
router.post("/register", async (req, res) => {
    try {
        const username = String(req.body.username || "").trim()
        const email = String(req.body.email || "").trim()
        const password = String(req.body.password || "")

        if (username === "" || email === "" || password === "") {
            return res.json({ ok: false, mensaje: "Faltan datos" })
        }

        // aca se chequea si ya existe alguien con ese username o ese email
        const existentes = await realizarQuery(
            "SELECT username FROM Users WHERE username = ? OR email = ?",
            [username, email]
        )
        if (existentes.length > 0) {
            if (existentes[0].username.toLowerCase() === username.toLowerCase()) {
                return res.json({ ok: false, mensaje: "El nombre de usuario ya está en uso" })
            }
            return res.json({ ok: false, mensaje: "El email ya está registrado" })
        }

        // se pone admin = 0 y blocked = 0 de forma que todos empiecen como jugadores comunes
        await realizarQuery(
            "INSERT INTO Users (username, email, password, admin, blocked) VALUES (?, ?, ?, 0, 0)",
            [username, email, password]
        )
        res.json({ ok: true })
    } catch (error) {
        errorServidor(res, error)
    }
})

// esto inicia sesión 
// ACLARACIÓN MUY IMPORTANTE: el front lo guarda en localStorage con la clave "usuario"
router.post("/login", async (req, res) => {
    try {
        const email = String(req.body.email || "").trim()
        const password = String(req.body.password || "")

        const usuarios = await realizarQuery(
            "SELECT id, username, email, password, admin, blocked FROM Users WHERE email = ?",
            [email]
        )
        const usuario = usuarios[0] // esto quiere decir que, si no existe ese email, queda undefined

        if (usuario === undefined || usuario.password !== password) {
            return res.json({ ok: false, mensaje: "Email o contraseña incorrectos" })
        }
        if (usuario.blocked) {
            return res.json({ ok: false, mensaje: "Tu usuario está bloqueado" })
        }

        // estos datos se guardan en la sesión (los usa permisos.js) y se mandan al front
        const datos = {
            id: usuario.id,
            username: usuario.username,
            email: usuario.email,
            admin: Boolean(usuario.admin),
        }
        req.session.user = datos
        res.json({ ok: true, usuario: datos })
    } catch (error) {
        errorServidor(res, error)
    }
})

// esto cierra la sesión
router.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({ ok: true })
    })
})

module.exports = router