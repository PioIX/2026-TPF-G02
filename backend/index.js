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
  resave: false,
  saveUninitialized: false,
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
 
// Tarea 11 (parte Socket.IO): sala de espera en tiempo real.

const {
    MIN_JUGADORES,
    buscarSala,
    motivoDeRechazo,
    agregarJugador,
    quitarJugador,
    datosSala,
} = require("./modulos/logicaSalas")

// esto es para esperar unos segundos antes de sacar a un jugador desconectado
const ESPERA_RECONEXION = 3000

 // le manda a todos los de la sala la lista actualizada
function avisarEstado(sala) {
  io.to(sala.codigo).emit("estadoSala", datosSala(sala))
}

// saca al jugador y avisa a los que quedan 
function sacarYAvisar(sala, idUsuario) {
  quitarJugador(sala, idUsuario)
  if (sala.jugadores.length > 0) {
    avisarEstado(sala)
  }
}

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
    if (!usuario) {
      return error("Tenés que iniciar sesión")
    }
    const sala = buscarSala(data && data.codigo)
    const motivo = motivoDeRechazo(sala, usuario)
    if (motivo !== "") {
      return error(motivo)
    }
    agregarJugador(sala, usuario, socket.id)
    socket.data.codigo = sala.codigo
    socket.join(sala.codigo)
    avisarEstado(sala)
  })

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
    if (!sala) {
      return error("No estás en una sala");
    }
    if (sala.anfitrion !== usuario.id) {
      return error("Solo el anfitrión puede iniciar la partida");
    }
    if (sala.estado !== "esperando") {
      return error("La partida ya empezó");
    }
    if (sala.jugadores.length < MIN_JUGADORES) {
      return error(`Hacen falta al menos ${MIN_JUGADORES} jugadores`);
    }
    sala.estado = "jugando";
    io.to(sala.codigo).emit("partidaIniciada", { codigo: sala.codigo });
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
 
  socket.on("disconnect", () => {
    const sala = salaActual();
    if (!sala || sala.estado !== "esperando") {
      return; 
    }
    setTimeout(() => {
      const jugador = sala.jugadores.find((j) => j.id === usuario.id);
      // solo se lo saca si no volvió a conectarse con otro socket
      if (jugador && jugador.socketId === socket.id) {
        sacarYAvisar(sala, usuario.id);
      }
    }, ESPERA_RECONEXION);
  });
})
