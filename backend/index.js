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

// saca a un jugador de la sala de espera, elige otro anfitrión si hace falta y avisa a los que quedan
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
  setTimeout(() => {
    // termina la ronda si se acabó el tiempo y por seguir en la misma ronda (no mandaron todos)
    if (sala !== null && sala.ronda === ronda) {
      terminarRonda();
    }
  }, (segundosDeRonda() + MARGEN_SEGUNDOS) * 1000);
}

// se llama cuando mandaron todos o cuando se acabó el tiempo
function terminarRonda() {
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

// guarda la partida terminada en la base de datos
async function guardarPartida() {
  const codigo = sala.codigo;
  const albumes = sala.albumes;
  try {
    const juego = await realizarQuery(
      "INSERT INTO Games (fecha, roomcode) VALUES (CURDATE(), ?)",
      [codigo],
    );
    for (let i = 0; i < albumes.length; i++) {
      const album = await realizarQuery(
        "INSERT INTO Albums (user_id, game_id) VALUES (?, ?)",
        [albumes[i].idDueno, juego.insertId],
      );
      for (let j = 0; j < albumes[i].pasos.length; j++) {
        const paso = albumes[i].pasos[j];
        await realizarQuery(
          "INSERT INTO Steps (album_id, orden, is_text, content, user_id) VALUES (?, ?, ?, ?, ?)",
          [album.insertId, j, paso.esTexto, paso.contenido, paso.idAutor],
        );
      }
    }
    console.log("Partida guardada");
  } catch (error) {
    console.error("No se pudo guardar la partida", error);
  }
}


// PEDIDOS HTTP


function errorServidor(res, error) {
  console.error(error);
  res.status(500).json({ ok: false, mensaje: "Error del servidor" });
}

// AUTENTICACIÓN

app.post("/register", async (req, res) => {
  try {
    const username = req.body.username.trim();
    const email = req.body.email.trim();
    const password = req.body.password;

    if (username === "" || email === "" || password === "") {
      return res.json({ ok: false, mensaje: "Faltan datos" });
    }

    // aca se chequea si ya existe alguien con ese username o ese email
    const existentes = await realizarQuery(
      "SELECT username FROM Users WHERE username = ? OR email = ?",
      [username, email],
    );
    if (existentes.length > 0) {
      return res.json({ ok: false, mensaje: "El usuario o el email ya están registrados" });
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

// el front guarda el usuario que devuelve esto en localStorage con la clave "usuario"
app.post("/login", async (req, res) => {
  try {
    const usuarios = await realizarQuery(
      "SELECT id, username, email, password, admin, blocked FROM Users WHERE email = ? AND password = ?", 
      [req.body.email.trim(), req.body.password],
    );
    if (usuarios.length === 0) {
      return res.json({ ok: false, mensaje: "Email o contraseña incorrectos" });
    }
    if (usuarios[0].blocked) {
      return res.json({ ok: false, mensaje: "Tu usuario está bloqueado" });
    }      
    res.json({ ok: true, usuario: usuarios[0] });
  } catch (error) {
    errorServidor(res, error);
  }
});

// FRASES

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

// ADMINISTRADOR (lo que empieza con /admin)

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
    const frase = req.body.frase.trim();
    if (frase === "") {
      return res.json({ ok: false, mensaje: "La frase no puede estar vacía" });
    }
    await realizarQuery("INSERT INTO SuggestedFrases (frase) VALUES (?)", [frase]);
    res.json({ ok: true });
  } catch (error) {
    errorServidor(res, error);
  }
});

// Cambia el texto de una frase.
app.put("/admin/frases", async (req, res) => {
  try {
    const frase = req.body.frase.trim();
    if (frase === "") {
      return res.json({ ok: false, mensaje: "La frase no puede estar vacía" });
    }
    await realizarQuery("UPDATE SuggestedFrases SET frase = ? WHERE id = ?", [frase, req.body.id]);
    res.json({ ok: true });
  } catch (error) {
    errorServidor(res, error);
  }
});

// Borra una frase
app.delete("/admin/frases", async (req, res) => {
  try {
    await realizarQuery("DELETE FROM SuggestedFrases WHERE id = ?", [req.body.id]);
    res.json({ ok: true });
  } catch (error) {
    errorServidor(res, error);
  }
});

// moderación: los 20 pasos mas nuevos, con el nombre de quien los hizo
// is_text vale 1 si es una frase o descripción y 0 si es un dibujo.
app.get("/admin/pasos", async (req, res) => {
  try {
    const pasos = await realizarQuery(
      `SELECT Steps.id, Steps.is_text, Steps.content, Users.username AS autor
       FROM Steps
       INNER JOIN Users ON Users.id = Steps.user_id
       ORDER BY Steps.id DESC
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
    await realizarQuery("DELETE FROM Steps WHERE id = ?", [req.body.id]);
    res.json({ ok: true });
  } catch (error) {
    errorServidor(res, error);
  }
});

// usuarios
// trae todos los usuarios (sin mandar la contraseña)
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

// bloquea o desbloquea. Recibe { id, blocked: true } para bloquear o { id, blocked: false } para desbloquear
app.put("/admin/usuarios/bloqueo", async (req, res) => {
  try {
    const usuarios = await realizarQuery(
      "SELECT admin FROM Users WHERE id = ?", [req.body.id]
    );
    // a un administrador no se lo puede bloquear
    if (usuarios[0].admin) {
      return res.json({ ok: false, mensaje: "No se puede bloquear a un administrador" });
    }
    await realizarQuery("UPDATE Users SET blocked = ? WHERE id = ?", [req.body.blocked, req.body.id]);
    res.json({ ok: true });
  } catch (error) {
    errorServidor(res, error);
  }
});


// SALA

// crea la sala. Recibe { usuario } (el que está guardado en localStorage)
app.post("/salas", (req, res) => {
  // si hay una sala con gente que todavia no termino de jugar, no se puede crear otra
  if (sala !== null && sala.estado !== "terminada" && sala.jugadores.length > 0) {
    return res.json({ ok: false, mensaje: "Ya hay una sala abierta. Pedile el código al anfitrión" });
  }
  sala = {
    codigo: generarCodigo(),
    anfitrion: req.body.usuario.id,
    estado: "esperando",
    jugadores: [], // { id, username, socketId }
    expulsados: [], // ids
  };
  res.json({ ok: true, codigo: sala.codigo });
});

// PARTIDA: esto no está Todavía


// WEBSOCKETS: todos los eventos reciben { usuario } (el de localStorage) desde el front


io.on("connection", (socket) => {
  function error(mensaje) {
    socket.emit("errorSala", { mensaje });
  }

  // SALA

  // Cada página lo emite al cargar y, según en que momento está la sala, se le responde una cosa distinta.
  socket.on("unirseSala", (data) => {
    const usuario = data.usuario
    if (sala === null) {
      return error("No hay ninguna sala abierta");
    }
    if (sala.expulsados.includes(usuario.id)) {
      return error("Te expulsaron de esta sala");
    }

    const jugador = sala.jugadores.find((j) => j.id === usuario.id);
    if (jugador) {
      // ya estaba en la sala: cambió de página, así que solo se actualiza su socket
      jugador.socketId = socket.id;
    } else {
      // es nuevo: tiene que poner bien el código y todavía tiene que haber lugar
      if (data.codigo !== sala.codigo) {
        return error("El código no es correcto");
      }
      if (sala.estado !== "esperando") {
        return error("La partida ya empezó");
      }
      if (sala.jugadores.length === MAX_JUGADORES) {
        return error("La sala está llena");
      }
      sala.jugadores.push({ id: usuario.id, username: usuario.username, socketId: socket.id });
    }

    socket.data.usuario = usuario; // lo usa el disconnect
    socket.join(sala.codigo);

    if (sala.estado === "esperando") {
      avisarEstado();
    } else if (sala.estado === "jugando") {
      socket.emit("recepcion", datosDeRonda(usuario.id));
    } else {
      // acá falta
    }
  });

  socket.on("expulsarJugador", (data) => {
    if (sala === null || sala.anfitrion !== data.usuario.id) {
      return error("Solo el anfitrión puede expulsar jugadores");
    }
    const jugador = sala.jugadores.find((j) => j.id === idJugador);
    if (!jugador) {
      return;
    }
    sala.expulsados.push(jugador.id);
    io.to(jugador.socketId).emit("expulsado"); // el front lo manda al menú
    quitarJugador(jugador.id);
  });

  socket.on("iniciarPartida", (data) => {
    if (sala === null || sala.anfitrion !== data.usuario.id) {
      return error("Solo el anfitrión puede iniciar la partida");
    }
    if (sala.estado !== "esperando") {
      return; // ya había empezado (por ejemplo, si apretó dos veces)
    }
    if (sala.jugadores.length < MIN_JUGADORES) {
      return error(`Hacen falta al menos ${MIN_JUGADORES} jugadores`);
    }
    empezarPartida();
    io.to(sala.codigo).emit("partidaIniciada"); // el front va a /escribir
  });

  // solo se puede salir en la sala de espera (en la partida, el que se va queda "sin respuesta")
  socket.on("salirSala", (data) => {
    if (sala === null || sala.estado !== "esperando") {
      return;
    }
    socket.leave(sala.codigo);
    quitarJugador(data.usuario.id);
  });

  // si alguien cierra la pestaña en la sala de espera, se lo saca (si no, la sala queda abierta para siempre)
  socket.on("disconnect", () => {
    if (!socket.data.usuario) {
      return;
    }
    const id = socket.data.usuario.id;
    // se espera un poco: si fue porque recargó la página, en ese tiempo ya volvió a entrar con otro socket
    setTimeout(() => {
      if (sala === null || sala.estado !== "esperando") {
        return;
      }
      const jugador = sala.jugadores.find((j) => j.id === id);
      if (jugador && jugador.socketId === socket.id) {
        quitarJugador(id);
      }
    }, ESPERA_RECONEXION);
  });

  // PARTIDA: falta
});
