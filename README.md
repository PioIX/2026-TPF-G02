# Proyecto interdisciplinario

**Segundo cuatrimestre**

**Título de la propuesta:** Gartic Pio  
**Grupo:** 02  
**División:** A

**Integrantes:**

- [Joaquin Brizuela Frias](mailto:jbrizuela@pioix.edu.ar)
- [Juan Ignacio Romano Mancuso](mailto:jromano@pioix.edu.ar)
- [Mateo Alejandro Carucci](mailto:mcarucci@pioix.edu.ar)
- [Mateo Alejandro Leonardi](mailto:mleonardi@pioix.edu.ar)

## Descripción de la propuesta

Gartic Pio es una aplicación web multijugador en tiempo real que recrea el juego “Gartic Phone”. Cada jugador escribe una frase; el siguiente la dibuja; el siguiente describe ese dibujo con palabras, y así se va alternando entre dibujo y texto hasta completar las rondas. Al final se revela, paso a paso, cómo se fue transformando cada frase original.

**Problemática o necesidad que aborda:** ofrecer una actividad divertida y colaborativa para compartir entre compañeros, que fomente la creatividad y la comunicación, y que pueda mostrarse en vivo durante la Expo Pio.

**Público objetivo:** estudiantes del colegio y visitantes de la Expo Pio (de 4 a 8 jugadores por partida).

**Objetivo general:** desarrollar una aplicación web completa (frontend, backend y base de datos) que permita jugar partidas en tiempo real, integrando comunicación HTTP y WebSockets, autenticación de usuarios, usuario administrador y persistencia de datos.

**Principales funcionalidades:** registro e inicio de sesión; menú principal para crear una sala o unirse con un código; partidas por rondas (escribir, dibujar, describir) con temporizador; pizarra de dibujo; revelación de los álbumes con lista de jugadores; consulta de álbumes de partidas anteriores; panel de administración con gestión de frases sugeridas, moderación y usuarios.

## Bocetos de la interfaz de la aplicación

https://canva.link/7gn0jolp1x23ym3 


## Alcance

**Funcionalidades que serán desarrolladas:**

- Pantalla de inicio con pestañas para iniciar sesión o registrarse, y un panel “Cómo jugar” que explica el juego paso a paso.
- Registro e inicio de sesión de usuarios (contraseña guardada con hash), con dos tipos de usuario: jugador y administrador. El administrador accede a un panel exclusivo. En todas las pantallas se muestra el usuario conectado (avatar con su inicial y nombre).
- Menú principal: después de iniciar sesión, el jugador elige entre crear una sala o unirse a una escribiendo su código, o ir a “Mis álbumes”.
- Sala de espera: muestra el código de sala (que se puede compartir), la lista de jugadores (de 4 a 8) con el anfitrión identificado y los lugares vacíos. El anfitrión puede expulsar jugadores e iniciar la partida.
- Partida en tiempo real mediante WebSockets: todos escriben una frase (pueden pedir una “frase al azar” de las cargadas por el administrador) y luego, en cada ronda, cada jugador recibe el álbum de otro, que alterna entre dibujar la frase y describir el dibujo. Cada ronda tiene un contador y un temporizador (60 segundos para escribir, 60 para dibujar y 30 para describir), y una pantalla de espera hasta que todos terminan. Si un jugador se desconecta, su paso queda como “sin respuesta” y la partida continúa.
- Pizarra de dibujo (canvas de HTML5) con colores, borrador, deshacer y limpiar, utilizable con el mouse. Al terminar, el dibujo se convierte en una URL (la imagen escrita como texto) para poder enviarlo y guardarlo.
- Revelación de álbumes: al terminar la partida, el anfitrión elige el modo (manual o automático) y empieza. Cada álbum se muestra en formato de chat con la lista de jugadores a un costado; los pasos aparecen de a uno, sincronizados para todos, y al final se pasa al álbum siguiente.
- Persistencia en la base de datos de partidas, álbumes y pasos (los dibujos se guardan como URL, la imagen escrita como texto), y consulta de los álbumes de partidas anteriores del usuario (“Mis álbumes”, con vista previa y fecha de cada partida).
- Panel del administrador (operaciones de creación, consulta, modificación y eliminación): frases sugeridas, moderación de contenido (eliminar pasos inapropiados) y lista de usuarios con bloqueo y desbloqueo, en línea con las normas de convivencia.
- Interfaz desarrollada con React y Next.js, que se comunica con el backend en Node.js mediante peticiones HTTP (fetch) y WebSockets (hook useSocket.js). Estilos con archivos .module.css y la librería clsx para los estados de los componentes, más un CSS global con la paleta de colores.

**Características esperadas del producto final:**

- Aplicación completa, funcional y ejecutable, con frontend, backend y base de datos accesible y completa.
- Un usuario con permisos de administrador para los docentes.
- Interfaz con identidad visual coherente en todas las pantallas, con logo e ilustraciones propios.
- Repositorio 2026-TPF-G02 en la organización PioIX, con documentación (README.md y DER actualizado respecto de la implementación final).

## Tareas

1. Creación y configuración del repositorio 2026-TPF-G02 en GitHub (organización PioIX): estructura de carpetas frontend/backend/docs, .gitignore, Team, ramas y README con este documento.
2. Diseño de las pantallas y de la paleta de colores en Canva (hecho el 08/10: 16 pantallas). La pantalla de “Describir” se arma a partir del boceto de referencia.
3. Base de datos – DER, creación de las tablas en MySQL (hecho el 14/10; el script de creación se guarda en la carpeta docs) y servidor Node.js con la conexión a MySQL (modulos/mysql.js), a partir del backend base del classroom.
4. Frontend – estructura del proyecto en Next.js y componentes base que se usan en varias pantallas (Botón, Logo, Cabecera con el usuario, Pestañas y Ventana modal), con sus estilos (.module.css) y el CSS global con la paleta y los fondos de cada fase. Fila de jugador y Avatar se arman junto con la sala de espera.
5. Investigación del canvas de HTML5 para la Pizarra: cómo dibujar con el mouse, cambiar colores y grosor, borrar, deshacer y exportar el dibujo como imagen.
6. Backend – registro, login y manejo de roles (jugador / administrador), guardando al usuario en la sesión (express-session).
7. Backend – crear, ver, modificar y borrar frases sugeridas (incluida la “frase al azar”), moderación de contenido y bloqueo de usuarios.
8. Frontend – pantallas de inicio (iniciar sesión y registrarse, con el panel “Cómo jugar” y sus imágenes) y menú principal (crear sala, unirse con código y “Mis álbumes”), con redirección según el rol.
9. Frontend – panel de administrador (frases, moderación y usuarios).
10. Frontend – componente Pizarra (canvas con colores, borrador, deshacer y limpiar). Al terminar, el dibujo se convierte en una URL con canvas.toDataURL, en un tamaño fijo y liviano (por ejemplo 800×600 en JPEG) para poder enviarlo y guardarlo; Socket.IO limita cada mensaje a 1 MB.
11. Backend – WebSockets: creación y unión a salas con código, lista de jugadores (de 4 a 8), expulsión de jugadores e inicio de partida, a partir del backend base del classroom.
12. Frontend – hook useSocket.js, sala de espera (con los componentes Fila de jugador y Avatar; jugadores, anfitrión, lugares vacíos y expulsar) y ventana para compartir el código.
13. Backend – lógica de rondas: rotación de álbumes y entrega de pasos entre jugadores. Los dibujos viajan como URL por WebSocket, igual que los textos.
14. Backend – temporizador por ronda (60 s escribir, 60 s dibujar, 30 s describir), cierre de ronda y manejo de jugadores desconectados. Los tiempos se guardan en constantes fáciles de cambiar, para poder alargarlos en la demostración.
15. Frontend – pantallas de partida (escribir frase con “frase al azar”, dibujar, describir, contador de ronda, reloj del temporizador y pantallas de espera), mostrando la pantalla que corresponde a cada fase de la partida. Al terminar de dibujar, el dibujo se envía como URL.
16. Revelación de los álbumes: ajustes del anfitrión (manual o automático) con una pantalla de espera para los demás jugadores, eventos WebSocket paso a paso y pantalla del álbum en formato de chat con la lista de jugadores y el fin de álbum (backend y frontend).
17. Guardado de partidas, álbumes y pasos en MySQL (los dibujos se guardan como URL en una columna de texto largo, LONGTEXT), y pantalla “Mis álbumes” con tarjetas (vista previa del último paso, código de partida y fecha) (backend y frontend).
18. Estilos finales – revisión de los estilos (.module.css) en todas las pantallas (inicio, sala, partida, pizarra, revelación y panel admin) para que todas tengan el mismo aspecto.
19. Pruebas con varios jugadores al mismo tiempo y corrección de errores. Para probar con varios jugadores usar distintos navegadores, perfiles de Chrome, ventanas de incógnito o varias computadoras, porque las pestañas de un mismo navegador comparten la sesión.
20. Preparación de la presentación y de la demostración para la Expo Pio. Con una sola computadora, la partida se simula con 4 jugadores en ventanas de distintos navegadores o perfiles (las pestañas de un mismo navegador comparten la sesión) y con tiempos más largos; se ensaya el recorrido completo antes.

## Responsabilidades

- Romano: 2, 7, 12, 13 y 17
- Brizuela: 4, 6, 11, 14 y 17
- Carucci: 3, 5, 8, 10, 15 y 16
- Leonardi: 1, 2, 3, 5, 9, 15 y 16

Las tareas 18, 19 y 20 las realizan los cuatro integrantes en conjunto. Cada integrante trabaja tanto en backend como en frontend y todos deben conocer y poder explicar el funcionamiento general del proyecto, no solo la parte que desarrollaron. En la tarea 3, Carucci hizo el DER y el servidor con la conexión a MySQL, y Leonardi creó las tablas en la base de datos.

## Planificación

Las fechas son de días de clase del proyecto: lunes y miércoles con dos clases por día, y jueves con una. No se cuentan los feriados del lunes 12/10 y del lunes 09/11.

| **N°** | **Objetivo** | **Tareas asociadas** | **Responsables** | **Fecha estimada** |
| --- | --- | --- | --- | --- |
| 1 | Organizar el repositorio | Repositorio, estructura, .gitignore, Team y README | Leonardi | Lun 05/10 |
| 2 | Diseñar las pantallas | Diseño de 16 pantallas y paleta en Canva (hecho) | Romano, Leonardi | Jue 08/10 |
| 3 | Preparar la base del sistema | DER, creación de las tablas en MySQL, servidor Node.js y conexión a MySQL | Carucci, Leonardi | Jue 15/10 |
| 4 | Componentes base | Estructura Next.js, Botón, Logo, Cabecera, Pestañas, Ventana modal y CSS global | Brizuela | Lun 19/10 |
| 5 | Investigación del canvas | Cómo dibujar con el mouse, colores, grosor, borrar, deshacer y exportar la imagen | Leonardi, Carucci | Lun 19/10 |
| 6 | Autenticación (back) | Registro, login y roles | Brizuela | Mié 21/10 |
| 7 | Administración (back) | Frases sugeridas, moderación y bloqueo de usuarios | Romano | Mié 21/10 |
| 8 | Autenticación (front) | Inicio, registro, login y menú principal | Carucci | Jue 22/10 |
| 9 | Administración (front) | Panel de administrador | Leonardi | Jue 22/10 |
|  | **HITO 1** | **Base del sistema: repositorio, base de datos, login con roles y panel de administración funcionando** | **Todos** | **Jue 22/10** |
| 10 | Pizarra de dibujo | Componente canvas con herramientas y dibujo como URL | Carucci | Mié 28/10 |
| 11 | Salas en tiempo real (back) | WebSockets: crear y unir salas, expulsar jugadores, iniciar partida | Brizuela | Mié 28/10 |
| 12 | Salas en tiempo real (front) | useSocket.js, sala de espera y código para compartir | Romano | Jue 29/10 |
| 13 | Lógica de la partida | Rotación de álbumes y entrega de pasos | Romano | Mié 04/11 |
| 14 | Control de rondas | Temporizador (tiempos configurables), cierre de ronda y desconexiones | Brizuela | Mié 04/11 |
| 15 | Pantallas de partida | Escribir, dibujar, describir, contador, reloj y espera | Carucci, Leonardi | Mié 04/11 |
|  | **HITO 2** | **Partida completa en tiempo real: salas, pizarra y rondas entre varios navegadores** | **Todos** | **Jue 05/11** |
| 16 | Revelación de álbumes | Ajustes del anfitrión, espera de los demás jugadores, eventos de revelación y pantalla del álbum | Carucci, Leonardi | Jue 12/11 |
| 17 | Guardado y consulta de partidas | Guardado de partidas, álbumes y pasos (con dibujos) en MySQL y pantalla “Mis álbumes” | Romano, Brizuela | Jue 12/11 |
| 18 | Dar estilos finales | Estilos (.module.css) en todas las pantallas | Todos | Lun 16/11 |
|  | **HITO 3** | **Versión completa y funcional de la aplicación** | **Todos** | **Lun 16/11** |
| 19 | Pruebas y cierre | Pruebas con varios jugadores y corrección de errores | Todos | Mié 18/11 |
| 20 | Presentación | Preparación de la demostración para la Expo Pio, con la partida simulada en una sola computadora | Todos | Jue 19/11 |
|  | **EXPO PIO** | **Presentación final** | **Todos** | **Vie 20/11** |

## Primer entregable (22/10)

Repositorio organizado, base de datos con DER y las tablas creadas, estructura base de frontend y backend, registro y login con roles, y panel de administrador con gestión de frases, moderación y bloqueo de usuarios.

## Segundo entregable (05/11)

Partida completa en tiempo real: salas con código, pizarra de dibujo y rondas de escribir, dibujar y describir con temporizador, funcionando con varios jugadores.

## Entrega final (16/11)

Revelación sincronizada de álbumes, guardado y consulta de partidas anteriores, estilos aplicados en todas las pantallas, y aplicación completa, funcional y ejecutable. Presentación en la Expo Pio el 20/11.

## Modelo de datos (DER)
después ponemos el der acá
