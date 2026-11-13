const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { Server } = require("socket.io");
const { realizarQuery } = require("../modulos/mysql");

const app = express();
const PORT = process.env.PORT || 4000;

const sessionMiddleware = session({
  secret: "supersarasa",
  resave: true,
  saveUninitialized: true,
});
app.use(sessionMiddleware);

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



// SALA Y PARTIDA


// mientras no hay ninguna sala, vale null
let sala = null;

const MIN_JUGADORES = 2;
const MAX_JUGADORES = 8;

// segundos de cada tipo de ronda 
const TIEMPO_ESCRIBIR = 60;
const TIEMPO_DIBUJAR = 60;
const TIEMPO_DESCRIBIR = 30;
// segundos de mas que espera el back, para que lleguen los envios automaticos del front
const MARGEN_SEGUNDOS = 3;
// segundos que se espera antes de sacar a un jugador desconectado
const ESPERA_RECONEXION = 3000;
 
// SALA
// basicamente se manejan las funciones de la sala de espera: codigo, lista de jugadores y sacar jugadores

// código de 5 números
function generarCodigo() {
  return String(Math.floor(10000 + Math.random() * 90000));
}

// le manda a todos los de la sala la lista actualizada de jugadores
function avisarEstado() {
  io.to(sala.codigo).emit("estadoSala", {
    codigo: sala.codigo,
    anfitrion: sala.anfitrion,
    minimo: MIN_JUGADORES,
    maximo: MAX_JUGADORES,
    jugadores: sala.jugadores.map((j) => ({ id: j.id, username: j.username })),
  });
}

// si se va el anfitrión, pasa a ser anfitrión el siguiente. Si no hay nadie, se borra la sala
function quitarJugador(idJugador) {
  sala.jugadores = sala.jugadores.filter((j) => j.id !== idJugador);
  if (sala.jugadores.length === 0) {
    sala = null;
    return;
  }
  if (sala.anfitrion === idJugador) {
    sala.anfitrion = sala.jugadores[0].id;
  }
  avisarEstado();
}

// PARTIDA
// las funciones de la partida: rondas, albumes, el reloj y el guardado en la base de datos

function segundosDeRonda() {
  if (sala.ronda === 0) {
    return TIEMPO_ESCRIBIR;
  }
  if (sala.ronda % 2 === 1) { // si es impar es de dibujar
    return TIEMPO_DIBUJAR;
  }
  return TIEMPO_DESCRIBIR;
}

// el álbum que le toca a un jugador en esta ronda
function albumDe(idJugador) {
  let posicion = sala.jugadores.findIndex((j) => j.id === idJugador) - sala.ronda;
  if (posicion < 0) {
    posicion = posicion + sala.jugadores.length; // se da la vuelta
  }
  return sala.albumes[posicion];
}

// guarda un paso en el álbum que le toca al jugador
function guardarPaso(jugador, contenido, esTexto) {
  albumDe(jugador.id).pasos.push({
    idAutor: jugador.id,
    autor: jugador.username,
    esTexto: esTexto,
    contenido: contenido,
  });
  sala.enviaron.push(jugador.id);
}

// arma lo que se le muestra al jugador según le toque describir o dibujar
function datosDeRonda(idJugador) {
  // lo que le llegó es el paso de la ronda anterior (en la ronda 0 no le llega nada)
  let recibido = null;
  if (sala.ronda > 0) {
    recibido = albumDe(idJugador).pasos[sala.ronda - 1];
  }
  return {
    ronda: sala.ronda + 1, // el front muestra 1/4, 2/4...
    totalRondas: sala.jugadores.length,
    recibido: recibido,
    segundos: segundosDeRonda(),
    enviado: sala.enviaron.includes(idJugador),
  };
}

function empezarPartida() {
  sala.estado = "jugando";
  sala.ronda = 0;
  sala.albumes = sala.jugadores.map((j) => ({ idDueno: j.id, dueno: j.username, pasos: [] }));
  empezarRonda();
}

function empezarRonda() {
  sala.enviaron = [];
  sala.reloj = setTimeout(terminarRonda, (segundosDeRonda() + MARGEN_SEGUNDOS) * 1000); // termina la ronda cuando se acaba el tiempo
}

// se llama cuando mandaron todos o cuando se acabó el tiempo
function terminarRonda() {
  clearTimeout(sala.reloj);
  // al que no mandó nada se le guarda "(sin respuesta)"
  sala.jugadores.forEach((j) => {
    if (!sala.enviaron.includes(j.id)) {
      guardarPaso(j, "(sin respuesta)", true);
    }
  });
  sala.ronda++;
  if (sala.ronda < sala.jugadores.length) {
    empezarRonda();
    io.to(sala.codigo).emit("nextStep", { nextstep: true });
  } else {
    sala.estado = "terminada";
    guardarPartida();
    io.to(sala.codigo).emit("nextStep", { nextstep: false });
  }
}

// PEDIDOS HTTP


// le manda a todos los de la sala la lista actualizada de jugadores
function avisarEstado() {
  io.to(sala.codigo).emit("estadoSala", datosSala());
}

function fraseValida(frase) {
  return frase !== "" && frase.length <= MAX_FRASE;
}

function errorServidor(res, error) {
  console.error(error);
  res.status(500).json({ ok: false, mensaje: "Error del servidor" });
}

// le manda a todos los de la sala la lista actualizada
function avisarEstado(sala) {
  console.log("pup pup, estado de sala *ruido de R2-D2*", datosSala(sala));
  const data = datosSala(sala);
  io.to(sala.codigo).emit("estadoSala", data);
}

// saca al jugador y avisa a los que quedan
function sacarYAvisar(sala, idUsuario) {
  quitarJugador(sala, idUsuario);
  if (sala.jugadores.length > 0) {
    avisarEstado(sala);
  }
}

// le avisa a toda la sala quiénes ya mandaron su paso de esta ronda
function avisarQuienEnvio(sala) {
  io.to(sala.codigo).emit("estadoRonda", {
    ronda: sala.partida.ronda,
    enviaron: sala.partida.enviaron,
  });
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
    const username = String(req.body.username || "").trim();
    const email = String(req.body.email || "").trim();
    const password = String(req.body.password || "");

    if (username === "" || email === "" || password === "") {
      return res.json({ ok: false, mensaje: "Faltan datos" });
    }

    // aca se chequea si ya existe alguien con ese username o ese email
    const existentes = await realizarQuery(
      "SELECT username FROM Users WHERE username = ? OR email = ?",
      [username, email],
    );
    if (existentes.length > 0) {
      if (existentes[0].username.toLowerCase() === username.toLowerCase()) {
        return res.json({
          ok: false,
          mensaje: "El nombre de usuario ya está en uso",
        });
      }
      return res.json({ ok: false, mensaje: "El email ya está registrado" });
    }
    // se pone admin = 0 y blocked = 0 de forma que todos empiecen como jugadores comunes
    await realizarQuery(
      "INSERT INTO Users (username, email, password, admin, blocked) VALUES (?, ?, ?, 0, 0)",
      [username, email, password],
    );
    res.json({ ok: true });
  } catch (error) {
    errorServidor(res, error);
  }
});
// Pedido de login
app.post("/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim();
    const password = String(req.body.password || "");

    const usuarios = await realizarQuery(
      "SELECT id, username, email, password, admin, blocked FROM Users WHERE email = ?",
      [email],
    );
    const usuario = usuarios[0]; // esto quiere decir que, si no existe ese email, queda undefined

    if (usuario === undefined || usuario.password !== password) {
      return res.json({ ok: false, mensaje: "Email o contraseña incorrectos" });
    }
    if (usuario.blocked) {
      return res.json({ ok: false, mensaje: "Tu usuario está bloqueado" });
    }

    // estos datos se guardan en la sesión (los usa permisos.js) y se mandan al front
    const datos = {
      id: usuario.id,
      username: usuario.username,
      email: usuario.email,
      admin: Boolean(usuario.admin),
    };
    req.session.user = datos;
    console.log({ datos });
    res.json({ ok: true, usuario: datos });
  } catch (error) {
    errorServidor(res, error);
  }
});

// Pedidos de admin (tarea 7)
// Lo que empieza con /admin es solo para administradores

// A partir de aca se trabaja con las frases sugeridas

// Trae una frase al azar para la pantalla de escribir
app.get("/frases/azar", async (req, res) => {
  try {
    const frases = await realizarQuery(
      "SELECT frase FROM SuggestedFrases ORDER BY RAND() LIMIT 1",
    );
    if (frases.length === 0) {
      return res.json({ ok: false, mensaje: "Todavía no hay frases cargadas" });
    }
    res.json({ ok: true, frase: frases[0].frase });
  } catch (error) {
    errorServidor(res, error);
  }
});

// Trae todas las frases.
app.get("/admin/frases", async (req, res) => {
  try {
    const frases = await realizarQuery(
      "SELECT id, frase FROM SuggestedFrases ORDER BY id DESC",
    );
    console.log("Me ejecute /admin/frases");
    res.json({ ok: true, frases });
  } catch (error) {
    errorServidor(res, error);
  }
});

// Crea una frase.
app.post("/admin/frases", async (req, res) => {
  try {
    const frase = String(req.body.frase || "").trim();
    if (!fraseValida(frase)) {
      return res.json({
        ok: false,
        mensaje: `La frase tiene que tener entre 1 y ${MAX_FRASE} letras`,
      });
    }
    const resultado = await realizarQuery(
      "INSERT INTO SuggestedFrases (frase) VALUES (?)",
      [frase],
    );
    res.json({ ok: true, frase: { id: resultado.insertId, frase } });
  } catch (error) {
    errorServidor(res, error);
  }
});

// Cambia el texto de una frase.
app.put("/admin/frases", async (req, res) => {
  try {
    const id = Number(req.body.id);
    const frase = String(req.body.frase || "").trim();
    if (!fraseValida(frase)) {
      return res.json({
        ok: false,
        mensaje: `La frase tiene que tener entre 1 y ${MAX_FRASE} letras`,
      });
    }
    const resultado = await realizarQuery(
      "UPDATE SuggestedFrases SET frase = ? WHERE id = ?",
      [frase, id],
    );
    // affectedRows es la cantidad de filas encontradas: si es 0, esa frase no existe
    if (resultado.affectedRows === 0) {
      return res.json({ ok: false, mensaje: "La frase no existe" });
    }
    res.json({ ok: true, frase: { id, frase } });
  } catch (error) {
    errorServidor(res, error);
  }
});

// Borra una frase
app.delete("/admin/frases", async (req, res) => {
  try {
    const resultado = await realizarQuery(
      "DELETE FROM SuggestedFrases WHERE id = ?",
      [Number(req.body.id)],
    );
    if (resultado.affectedRows === 0) {
      return res.json({ ok: false, mensaje: "La frase no existe" });
    }
    res.json({ ok: true });
  } catch (error) {
    errorServidor(res, error);
  }
});

/* A partir de aca se trabaja con la moderación */

// Trae los 20 pasos más nuevos, con quién los hizo y el código de la partida.
// is_text vale 1 si es una frase o descripción y 0 si es un dibujo.
// En los dibujos, content es la imagen (texto muy largo), por eso se traen pocos.

app.get("/admin/pasos", async (req, res) => {
  try {
    const pasos = await realizarQuery(
      `SELECT s.id, s.is_text, s.content, u.username AS autor, g.roomcode
                FROM Steps s
                INNER JOIN Users u ON u.id = s.user_id
                INNER JOIN Albums a ON a.id = s.album_id
                INNER JOIN Games g ON g.id = a.game_id
                ORDER BY s.id DESC
                LIMIT 20`,
    );
    res.json({ ok: true, pasos });
  } catch (error) {
    errorServidor(res, error);
  }
});

// Borra un paso inapropiado
app.delete("/admin/pasos", async (req, res) => {
  try {
    const resultado = await realizarQuery("DELETE FROM Steps WHERE id = ?", [
      Number(req.body.id),
    ]);
    if (resultado.affectedRows === 0) {
      return res.json({ ok: false, mensaje: "El paso no existe" });
    }
    res.json({ ok: true });
  } catch (error) {
    errorServidor(res, error);
  }
});

/* A partir de aca se trabaja con la parte de usuarios */

// Trae todos los usuarios (nunca se manda la contraseña)
app.get("/admin/usuarios", async (req, res) => {
  try {
    const usuarios = await realizarQuery(
      "SELECT id, username, email, admin, blocked FROM Users ORDER BY username",
    );
    res.json({ ok: true, usuarios });
  } catch (error) {
    errorServidor(res, error);
  }
});

// Bloquea o desbloquea. Recibe { blocked: true } o { blocked: false }
app.put("/admin/usuarios/bloqueo", async (req, res) => {
  try {
    const id = req.body.id;
    console.log(id);
    const blocked = req.body.blocked ? 1 : 0;

    const usuarios = await realizarQuery(
      "SELECT admin FROM Users WHERE id = ?",
      [id],
    );
    console.log(usuarios);
    if (usuarios.length === 0) {
      return res.json({ ok: false, mensaje: "El usuario no existe" });
    } else {
      if (usuarios[0].admin) {
        // un administrador no se puede bloquear (ni a si mismo)
        return res.json({
          ok: false,
          mensaje: "No se puede bloquear a un administrador",
        });
      } else {
        await realizarQuery("UPDATE Users SET blocked = ? WHERE id = ?", [
          blocked,
          id,
        ]);
        res.json({ ok: true, blocked: blocked === 1 });
      }
    }
  } catch (error) {
    errorServidor(res, error);
  }
});

// Algunos pedidos de salas
// crea una sala nueva
app.post("/salas", async (req, res) => {
  console.log("req body user:", req.body.user);
  const datosUser = await realizarQuery(
    "SELECT id , username FROM Users WHERE username = ?",
    [req.body.user],
  );
  console.log("datus user ", datosUser);
  const datos = {
    id: datosUser[0].id,
    username: req.body.user,
  };
  const codigo = crearSala(datos);
  const data = {
    id: datosUser[0].id,
    username: req.body.user,
    codigo: codigo,
  };
  console.log(data);
  res.json({ ok: true, data });
});

// avisa si el usuario puede entrar a esa sala.
app.get("/salas", async (req, res) => {
  const sala = buscarSala(req.query.codigo);
  const motivo = motivoDeRechazo(sala, req.session.user);
  if (motivo !== "") {
    return res.json({ ok: false, mensaje: motivo });
  }
  const datosUser = await realizarQuery(
    "SELECT id , username FROM Users WHERE username = ?",
    [req.body.user],
  );
  const datos = {
    id: datosUser[0].id,
    username: req.body.user,
    codigo: sala.codigo,
  };
  res.json({ ok: true, datos });
});

io.on("connection", (socket) => {
  // este es el usuario que inició sesión (lo guardó el login en la sesión)
  const usuario = socket.request.session.user;

  function error(mensaje) {
    socket.emit("errorSala", { mensaje });
  }

  // la sala en la que está este socket (se guarda en unirseSala)
  function salaActual() {
    return buscarSala(socket.data.codigo);
  }

  socket.on("unirseSala", (data) => {
    if (data.usuario == undefined) {
      return error("Tenés que iniciar sesión");
    }
    const sala = buscarSala(data && data.codigo);
    const motivo = motivoDeRechazo(sala, data.usuario);
    if (motivo !== "") {
      return error(motivo);
    }
    console.log("data a jugador", data);
    agregarJugador(sala, data, socket.id);
    socket.data.codigo = sala.codigo;
    socket.join(sala.codigo);
    avisarEstado(sala);
    // si la partida ya empezó se le manda lo que le toca hacer en la ronda actual
    if (sala.estado === "jugando") {
      socket.emit("nuevaRonda", tareaDeRonda(sala, usuario.id));
      socket.emit("estadoRonda", {
        ronda: sala.partida.ronda,
        enviaron: sala.partida.enviaron,
      });
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
    if (!sala) {
      //MAL
      return error("No estás en una sala"); //MAL
    } //MAL
    if (sala.anfitrion !== usuario.id) {
      //MAL
      return error("Solo el anfitrión puede iniciar la partida"); //MAL
    } //MAL
    if (sala.estado !== "esperando") {
      //MAL
      return error("La partida ya empezó"); //MAL
    } //MAL
    if (sala.jugadores.length < MIN_JUGADORES) {
      //BIEN
      return error(`Hacen falta al menos ${MIN_JUGADORES} jugadores`); //BIEN
    } //BIEN
    sala.estado = "jugando"; //BIEN
    io.to(sala.codigo).emit("partidaIniciada", { codigo: sala.codigo }); //BIEN
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
});
