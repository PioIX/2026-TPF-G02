const { crearSala, buscarSala, motivoDeRechazo } = require("../modulos/logicaSalas")

module.exports = (app) => {
    // crea una sala nueva
    app.post("/salas", (req, res) => {
        console.log(req.session.user)
        const codigo = crearSala(req.session.user)
        const data = {
            usuario: req.session.user,
            codigo:codigo
        }
        res.json({ ok: true, data })
    })

    // avisa si el usuario puede entrar a esa sala.
    app.get("/salas/codigo", (req, res) => {
        const sala = buscarSala(req.body.codigo)
        const motivo = motivoDeRechazo(sala, req.session.user)
        if (motivo !== "") {
            return res.json({ ok: false, mensaje: motivo })
        }
        res.json({ ok: true, codigo: sala.codigo })
    })
}