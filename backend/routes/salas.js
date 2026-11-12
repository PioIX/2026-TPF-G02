const { crearSala, buscarSala, motivoDeRechazo } = require("../modulos/logicaSalas")
const { realizarQuery } = require("../modulos/mysql")
module.exports = (app) => {
    // crea una sala nueva
    app.post("/salas",async (req, res) => {
        console.log("req body user:",req.body.user)
        const datosUser = await realizarQuery("SELECT id , username FROM Users WHERE username = ?",[req.body.user] )
        console.log("datus user ",datosUser)
        const datos = {
            id: datosUser[0].id,
            username: req.body.user
        }
        const codigo = crearSala(datos)
        const data = {
            id: datosUser[0].id,
            username: req.body.user,
            codigo:codigo
        }
        console.log(data)
        res.json({ ok: true, data })
    })

    // avisa si el usuario puede entrar a esa sala.
    app.get("/salas", async (req, res) => {
        const sala = buscarSala(req.query.codigo)
        const motivo = motivoDeRechazo(sala, req.session.user)
        if (motivo !== "") {
            return res.json({ ok: false, mensaje: motivo })
        }
        const datosUser = await realizarQuery("SELECT id , username FROM Users WHERE username = ?",[req.body.user] )
        const datos = {
            id: datosUser[0].id,
            username: req.body.user,
            codigo:sala.codigo
        }
        res.json({ ok: true, datos  })
    })
}