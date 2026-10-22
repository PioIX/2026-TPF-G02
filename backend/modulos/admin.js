// Tarea 7: frases sugeridas, moderación de pasos y bloqueo de usuarios.
const express = require("express")
const { realizarQuery } = require("./mysql")
const { soloLogueado, soloAdmin } = require("./permisos")

const router = express.Router()
const MAX_FRASE = 200
// Lo que empieza con /admin es solo para administradores
router.use("/admin", soloAdmin)

function fraseValida(frase) {
    return frase !== "" && frase.length <= MAX_FRASE
}

function errorServidor(res, error) {
    console.error(error)
    res.status(500).json({ ok: false, mensaje: "Error del servidor" })
}

/* A partir de aca se trabaja con las frases sugeridas */
// Trae una frase al azar para la pantalla de escribir. 
router.get("/frases/azar", soloLogueado, async (req, res) => {
    try {
        const frases = await realizarQuery("SELECT frase FROM SuggestedFrases ORDER BY RAND() LIMIT 1")
        if (frases.length === 0) {
            return res.status(404).json({ ok: false, mensaje: "Todavía no hay frases cargadas" })
        }
        res.json({ ok: true, frase: frases[0].frase })
    } catch (error) {
        errorServidor(res, error)
    }
})

// Trae todas las frases.
router.get("/admin/frases", async (req, res) => {
    try {
        const frases = await realizarQuery("SELECT id, frase FROM SuggestedFrases ORDER BY id DESC")
        res.json({ ok: true, frases })
    } catch (error) {
        errorServidor(res, error)
    }
})

// Crea una frase.
router.post("/admin/frases", async (req, res) => {
    try {
        const frase = String(req.body.frase || "").trim()
        if (!fraseValida(frase)) {
            return res.status(400).json({ ok: false, mensaje: `La frase tiene que tener entre 1 y ${MAX_FRASE} letras` })
        }
        const resultado = await realizarQuery("INSERT INTO SuggestedFrases (frase) VALUES (?)", [frase])
        res.status(201).json({ ok: true, frase: { id: resultado.insertId, frase } })
    } catch (error) {
        errorServidor(res, error)
    }
})

// Cambia el texto de una frase.
router.put("/admin/frases/:id", async (req, res) => {
    try {
        const id = Number(req.params.id)
        const frase = String(req.body.frase || "").trim()
        if (!fraseValida(frase)) {
            return res.status(400).json({ ok: false, mensaje: `La frase tiene que tener entre 1 y ${MAX_FRASE} letras` })
        }
        const resultado = await realizarQuery("UPDATE SuggestedFrases SET frase = ? WHERE id = ?", [frase, id])
        // affectedRows es la cantidad de filas encontradas: si es 0, esa frase no existe
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ ok: false, mensaje: "La frase no existe" })
        }
        res.json({ ok: true, frase: { id, frase } })
    } catch (error) {
        errorServidor(res, error)
    }
})

// Borra una frase
router.delete("/admin/frases/:id", async (req, res) => {
    try {
        const resultado = await realizarQuery("DELETE FROM SuggestedFrases WHERE id = ?", [Number(req.params.id)])
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ ok: false, mensaje: "La frase no existe" })
        }
        res.json({ ok: true })
    } catch (error) {
        errorServidor(res, error)
    }
})

/* A partir de aca se trabaja con la moderación */

// Trae los 20 pasos más nuevos, con quién los hizo y el código de la partida.
// is_text vale 1 si es una frase o descripción y 0 si es un dibujo.
// En los dibujos, content es la imagen (texto muy largo), por eso se traen pocos.

router.get("/admin/pasos", async (req, res) => {
    try {
        const pasos = await realizarQuery(
            `SELECT s.id, s.is_text, s.content, u.username AS autor, g.roomcode
               FROM Steps s
               INNER JOIN Users u ON u.id = s.user_id
               INNER JOIN Albums a ON a.id = s.album_id
               INNER JOIN Games g ON g.id = a.game_id
              ORDER BY s.id DESC
              LIMIT 20`
        )
        res.json({ ok: true, pasos })
    } catch (error) {
        errorServidor(res, error)
    }
})
 
// Borra un paso inapropiado
router.delete("/admin/pasos/:id", async (req, res) => {
    try {
        const resultado = await realizarQuery("DELETE FROM Steps WHERE id = ?", [Number(req.params.id)])
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ ok: false, mensaje: "El paso no existe" })
        }
        res.json({ ok: true })
    } catch (error) {
        errorServidor(res, error)
    }
})


/* A partir de aca se trabaja con la parte de usuarios */

// Trae todos los usuarios (nunca se manda la contraseña)
router.get("/admin/usuarios", async (req, res) => {
    try {
        const usuarios = await realizarQuery("SELECT id, username, email, admin, blocked FROM Users ORDER BY username")
        res.json({ ok: true, usuarios })
    } catch (error) {
        errorServidor(res, error)
    }
})

// Bloquea o desbloquea. Recibe { blocked: true } o { blocked: false }
router.put("/admin/usuarios/:id/bloqueo", async (req, res) => {
    try {
        const id = Number(req.params.id)
        const blocked = req.body.blocked ? 1 : 0

        const usuarios = await realizarQuery("SELECT admin FROM Users WHERE id = ?", [id])
        if (usuarios.length === 0) {
            return res.status(404).json({ ok: false, mensaje: "El usuario no existe" })
        }
        // un administrador no se puede bloquear (ni a sí mismo)
        if (usuarios[0].admin) {
            return res.status(400).json({ ok: false, mensaje: "No se puede bloquear a un administrador" })
        }

        await realizarQuery("UPDATE Users SET blocked = ? WHERE id = ?", [blocked, id])
        res.json({ ok: true, blocked: blocked === 1 })
    } catch (error) {
        errorServidor(res, error)
    }
})

module.exports = router

//permisos.js:
// Estas dos funciones se ponen antes de las rutas para decidir quién puede entrar.
// Usan lo que guardó el login en la sesión: req.session.user = { id, username, admin }

// Deja pasar a cualquier usuario que haya iniciado sesión
function soloLogueado(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ ok: false, mensaje: "Tenés que iniciar sesión" })
    }
    next()
}

// Deja pasar solo a los administradores (en la tabla Users, admin vale 1)
function soloAdmin(req, res, next) {
    const usuario = req.session.user
    if (!usuario) {
        return res.status(401).json({ ok: false, mensaje: "Tenés que iniciar sesión" })
    }
    if (!usuario.admin) {
        return res.status(403).json({ ok: false, mensaje: "Solo para administradores" })
    }
    next()
}

module.exports = { soloLogueado, soloAdmin }