const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { Server } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 4000;

// se pone credentials true para que el navegador guarde y mande la cookie de la sesión
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001"], credentials: true }));
app.use(express.json());

const sessionMiddleware = session({
  secret: "supersarasa",
  resave: true,
  saveUninitialized: true,
});
app.use(sessionMiddleware);

// se ponen las rutas del proyecto
require("./routes/auth")(app);
require("./routes/admin")(app);
require("./routes/salas")(app);

const server = app.listen(PORT, () => {
  console.log(`Servidor NodeJS corriendo en http://localhost:${PORT}/`);
});

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});
 
// esto es para que los sockets también puedan leer la sesión (socket.request.session.user)
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});


const {
    MIN_JUGADORES,
    buscarSala,
    motivoDeRechazo,
    agregarJugador,
    quitarJugador,
    datosSala,
} = require("./modulos/logicaSalas")

const {
  MARGEN_SEGUNDOS,
  duracionDeRonda,
  crearPartida,
  tareaDeRonda,
  guardarPaso,
  todosEnviaron,
  siguienteRonda,
} = require("./modulos/logicaPartida");

// esto es para esperar unos segundos antes de sacar a un jugador desconectado
const ESPERA_RECONEXION = 3000

 // le manda a todos los de la sala la lista actualizada
function avisarEstado(sala) {
  console.log("pup pup, estado de sala *ruido de R2-D2*",datosSala(sala))
  const data = datosSala(sala)
  io.to(sala.codigo).emit("estadoSala", data)
}

// saca al jugador y avisa a los que quedan 
function sacarYAvisar(sala, idUsuario) {
  quitarJugador(sala, idUsuario)
  if (sala.jugadores.length > 0) {
    avisarEstado(sala)
  }
}

// le avisa a toda la sala quiénes ya mandaron su paso de esta ronda
function avisarQuienEnvio(sala) {
  io.to(sala.codigo).emit("estadoRonda", { ronda: sala.partida.ronda, enviaron: sala.partida.enviaron });
}

// le manda a cada jugador lo que le toca hacer en la ronda actual
function enviarRonda(sala) {
  sala.jugadores.forEach((jugador) => {
    io.to(jugador.socketId).emit("nuevaRonda", tareaDeRonda(sala, jugador.id));
  });
  avisarQuienEnvio(sala);
}

// cierra la ronda actual y empieza la siguiente (o termina la partida).
function pasarDeRonda(sala) {
  const termino = siguienteRonda(sala);
  if (termino) {
    sala.estado = "terminada";
    io.to(sala.codigo).emit("partidaTerminada", { codigo: sala.codigo });
  } else {
    enviarRonda(sala);
  }
}
// Pedidos al backend
// Pedidos  de autenticacion
// Registro
app.post("/register", async (req, res) => {
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
    }catch (error) {
        errorServidor(res, error)
    }
})
// Pedido de login
app.post("/login", async (req, res) => {
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
            console.log({datos})
            res.json({ ok: true, usuario: datos })
        } catch (error) {
            errorServidor(res, error)
        }
    })
//
io.on("connection", (socket) => {
  // este es el usuario que inició sesión (lo guardó el login en la sesión)
  const usuario = socket.request.session.user

  function error(mensaje) {
    socket.emit("errorSala", { mensaje })
  }

  // la sala en la que está este socket (se guarda en unirseSala)
  function salaActual() {
    return buscarSala(socket.data.codigo)
  }

  socket.on("unirseSala", (data) => {
    if (data.usuario == undefined) {
      return error("Tenés que iniciar sesión")
    }
    const sala = buscarSala(data && data.codigo)
    const motivo = motivoDeRechazo(sala, data.usuario)
    if (motivo !== "") {
      return error(motivo);
    }
    console.log("data a jugador", data)
    agregarJugador(sala, data, socket.id)
    socket.data.codigo = sala.codigo;
    socket.join(sala.codigo);
    avisarEstado(sala);
    // si la partida ya empezó se le manda lo que le toca hacer en la ronda actual
    if (sala.estado === "jugando") {
      socket.emit("nuevaRonda", tareaDeRonda(sala, usuario.id));
      socket.emit("estadoRonda", { ronda: sala.partida.ronda, enviaron: sala.partida.enviaron });
    }
    // si la partida ya terminó se le avisa de nuevo
    if (sala.estado === "terminada") {
      socket.emit("partidaTerminada", { codigo: sala.codigo });
    }
  });

  socket.on("expulsarJugador", (data) => {
    const sala = salaActual();
    if (!sala) {
      return error("No estás en una sala");
    }
    if (sala.anfitrion !== usuario.id) {
      return error("Solo el anfitrión puede expulsar jugadores");
    }
    const idJugador = Number(data && data.idJugador);
    if (idJugador === usuario.id) {
      return error("No podés expulsarte a vos mismo");
    }
    const jugador = sala.jugadores.find((j) => j.id === idJugador);
    if (!jugador) {
      return error("Ese jugador no está en la sala");
    }
 
    sala.expulsados.push(idJugador);
    // se le avisa al expulsado y se lo saca de la sala de Socket.IO
    const socketExpulsado = io.sockets.sockets.get(jugador.socketId);
    if (socketExpulsado) {
      socketExpulsado.emit("expulsado");
      socketExpulsado.leave(sala.codigo);
      socketExpulsado.data.codigo = null;
    }
    sacarYAvisar(sala, idJugador);
  });
 
  socket.on("iniciarPartida", () => {
    const sala = salaActual();
    if (!sala) { //MAL
      return error("No estás en una sala");//MAL
    }//MAL
    if (sala.anfitrion !== usuario.id) {//MAL
      return error("Solo el anfitrión puede iniciar la partida");//MAL
    }//MAL
    if (sala.estado !== "esperando") {//MAL
      return error("La partida ya empezó");//MAL
    }//MAL
    if (sala.jugadores.length < MIN_JUGADORES) {//BIEN
      return error(`Hacen falta al menos ${MIN_JUGADORES} jugadores`);//BIEN
    }//BIEN
    sala.estado = "jugando";//BIEN
    io.to(sala.codigo).emit("partidaIniciada", { codigo: sala.codigo });//BIEN
  });
 
  socket.on("salirSala", () => {
    const sala = salaActual();
    if (!sala) {
      return;
    }
    socket.leave(sala.codigo);
    socket.data.codigo = null;
    sacarYAvisar(sala, usuario.id);
  });

  socket.on("enviarPaso", (data) => {
    const sala = salaActual();
    if (!sala || sala.estado !== "jugando") {
      return error("No hay una partida en juego");
    }
    const motivo = guardarPaso(sala, usuario.id, data && data.contenido);
    if (motivo !== "") {
      return error(motivo);
    }
    // Cuando todos mandaron su paso, se pasa a la ronda siguiente; si no, se avisa quiénes ya enviaron
    if (todosEnviaron(sala)) {
      pasarDeRonda(sala);
    } else {
      avisarQuienEnvio(sala);
    }
  });
 
//   socket.on("disconnect", () => {
//     const sala = salaActual();
//     if (!sala || sala.estado !== "esperando") {
//       return; 
//     }
//     setTimeout(() => {
//       console.log("sala",sala)
//       const jugador = sala.jugadores.find((j) => j.id === data.id);
//       // solo se lo saca si no volvió a conectarse con otro socket
//       if (jugador && jugador.socketId === socket.id) {
//         sacarYAvisar(sala, usuario.id);
//       }
//     }, ESPERA_RECONEXION);
//   });
})
