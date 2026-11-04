const { soloLogueado } = require("../modulos/permisos")
const { crearSala, buscarSala, motivoDeRechazo } = require("../modulos/logicaSalas")

module.exports = (app) => {
    // crea una sala nueva
    app.post("/salas", soloLogueado, (req, res) => {
        const codigo = crearSala(req.session.user)
        res.json({ ok: true, codigo })
    })

    // avisa si el usuario puede entrar a esa sala.
    app.get("/salas/:codigo", soloLogueado, (req, res) => {
        const sala = buscarSala(req.params.codigo)
        const motivo = motivoDeRechazo(sala, req.session.user)
        if (motivo !== "") {
            return res.json({ ok: false, mensaje: motivo })
        }
        res.json({ ok: true, codigo: sala.codigo })
    })
}