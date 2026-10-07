//  Proyecto de Producción - 5to Informática

// Docentes: Matías Marchesi, Martín Rivas

// Año 2025

// Cargo librerías instaladas y necesarias
const express = require('express');						// Para el manejo del web server
const bodyParser = require('body-parser'); 				// Para el manejo de los strings JSON
const cors = require('cors');


const app = express();                                  // Inicializo express para el manejo de las peticiones

app.use(cors());            							// Inicializo express para el manejo de las peticiones

app.use(bodyParser.urlencoded({ extended: false }));	// Inicializo el parser JSON
app.use(bodyParser.json());

const LISTEN_PORT = 4000;								// Puerto por el que estoy ejecutando la página Web

const server = app.listen(LISTEN_PORT, () => {
    console.log(`Servidor NodeJS corriendo en http://localhost:${LISTEN_PORT}/`);
});;

const empleos = [
  {
    id: 1,
    cargo: "Desarrollador Junior",
    empresa: "DiwaIT",
    descripcion: "El postulante debe contar con conocimientos de Next JS"
  },
  {
    id: 2,
    cargo: "Diseñador UX/UI",
    empresa: "Nexo Digital",
    descripcion: "Se requiere experiencia en diseño de interfaces web"
  },
  {
    id: 3,
    cargo: "Analista de datos",
    empresa: "DataSur",
    descripcion: "El postulante debe contar con conocimientos de bases de datos"
  },
  {
    id: 4,
    cargo: "Desarrollador Backend",
    empresa: "CodeFactory",
    descripcion: "Se requiere experiencia con Node JS y Express"
  }
];

app.get('/empleos', function (req, res) {
    res.send({ empleos: empleos });
});

app.post('/agregarEmpleo', function (req, res) {
    const { cargo, empresa, descripcion } = req.body;

    if (!cargo || !empresa || !descripcion) {
        res.status(400).send({ ok: false, mensaje: "Faltan datos para agregar el empleo." });
        return;
    }

    const nuevoEmpleo = {
        id: empleos.length + 1,
        cargo,
        empresa,
        descripcion
    };

    empleos.push(nuevoEmpleo);
    res.send({ ok: true, empleo: nuevoEmpleo, empleos: empleos });
});