// Deja pasar a cualquier usuario que haya iniciado sesión
function soloLogueado(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ ok: false, mensaje: "Tenés que iniciar sesión" })
    }
    next()
}

// Deja pasar solo a los administradores (en la tabla Users, admin vale 1)
function soloAdmin(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ ok: false, mensaje: "Tenés que iniciar sesión" })
    }
    if (!req.session.user.admin) {
        return res.status(403).json({ ok: false, mensaje: "Solo para administradores" })
    }
    next()
}

module.exports = { soloLogueado, soloAdmin }