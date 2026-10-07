# Proyecto interdisciplinario
 
## Segundo cuatrimestre
 
**Título de la propuesta:** Gartic Phone
**Grupo:** 02  
**División:** A
 
**Integrantes:**
 
- [Joaquin Brizuela Frias](mailto:jbrizuela@pioix.edu.ar)
- [Juan Ignacio Romano Mancuso](mailto:jromano@pioix.edu.ar)
- [Mateo Alejandro Carucci](mailto:mcarucci@pioix.edu.ar)
- [Mateo Alejandro Leonardi](mailto:mleonardi@pioix.edu.ar)
---
 
## Descripción de la propuesta
 
Es una aplicación web multijugador en tiempo real basada en el juego llamado "Gartic Phone". Cada jugador escribe una frase; el siguiente la dibuja; el siguiente describe ese dibujo con palabras, y así se va alternando entre dibujo y texto hasta completar las rondas. Al final se revela, paso a paso, cómo se fue transformando cada frase original. Cada frase o dibujo dentro de un álbum se llama "paso".
 
## Problemática o necesidad que aborda
 
Ofrecer una actividad divertida y colaborativa para compartir entre compañeros, que fomente la creatividad y la comunicación, y que pueda jugarse en vivo durante la Expo Pio.
 
## Público objetivo
 
Estudiantes del colegio y visitantes de la Expo Pio (de 4 a 8 jugadores por partida).
 
## Objetivo general
 
Desarrollar una aplicación web completa (frontend, backend y base de datos) que permita jugar partidas en tiempo real, integrando comunicación HTTP y WebSockets, autenticación de usuarios, usuario administrador y persistencia de datos.
 
## Principales funcionalidades
 
Registro e inicio de sesión; salas con código; partidas por rondas (escribir, dibujar, describir) con temporizador; pizarra de dibujo; revelación final de los álbumes; consulta de álbumes de partidas anteriores; panel de administración con gestión de frases sugeridas y moderación.
 
## Bocetos de la interfaz de la aplicación
 
Completar con imágenes realizadas en Canva de cómo se verán las distintas páginas presentes en la aplicación.
 
---
 
## Alcance
 
### Funcionalidades que serán desarrolladas
 
- Registro e inicio de sesión de usuarios, con dos tipos de usuario: jugador y administrador. El administrador accede a un panel exclusivo.
- Salas de juego: un jugador crea una sala y comparte un código; los demás se unen con él (de 4 a 8 jugadores). El anfitrión inicia la partida.
- Partida en tiempo real mediante WebSockets: todos escriben una frase y luego, en cada ronda, cada jugador recibe el álbum de otro, que alterna entre dibujar la frase y describir el dibujo. Cada ronda tiene un temporizador. Si un jugador se desconecta, su paso queda como "sin respuesta" y la partida continúa.
- Pizarra de dibujo (canvas de HTML5) con colores, grosor, borrador y deshacer, utilizable con mouse o con el dedo desde el celular.
- Revelación final sincronizada: se muestra cada álbum paso a paso a todos los jugadores a la vez.
- Persistencia en la base de datos de partidas, álbumes y pasos, y consulta de los álbumes de partidas anteriores del usuario.
- Panel del administrador (operaciones de creación, consulta, modificación y eliminación): categorías y frases sugeridas; moderación de contenido (eliminar pasos inapropiados); y bloqueo o desbloqueo de usuarios.
- Interfaz desarrollada con React y Next.js, que se comunica con el backend en Node.js mediante peticiones HTTP (fetch) y WebSockets (hook `useSocket`).
### Características esperadas del producto final
 
- Aplicación completa, funcional y ejecutable, con frontend, backend y base de datos accesible y completa.
- Un usuario con permisos de administrador para los docentes.
- Interfaz con identidad visual coherente en todas las pantallas.
- Repositorio `2026-TPF-G02` en la organización PioIX, con documentación (`README.md` y DER actualizado respecto de la implementación final).
---
 
## Tareas
 
1. Crear y configurar el repositorio `2026-TPF-G02` en GitHub (organización PioIX): carpetas `frontend`, `backend` y `docs`, archivo `.gitignore`, Team del grupo, ramas y README con este documento. *(Realizada el 05/10.)*
2. Diseñar el aspecto de la aplicación en dos partes. **Parte 1, bocetos en Canva:** diseño de todas las pantallas con la paleta de colores y la tipografía elegidas (identidad visual); fecha límite: jueves 08/10. **Parte 2, CSS global:** un único archivo de estilos (`globals.css`, en `frontend/src/app/`) que se aplica a toda la aplicación y contiene los colores y la tipografía definidos en los bocetos y los estilos compartidos por todas las pantallas (botones, formularios y distribución general). Así no se repiten estilos en cada pantalla y todas mantienen la misma identidad visual; los detalles propios de cada pantalla se agregan después, en la tarea 16.
3. Diseñar la base de datos: DER (entidades, atributos y relaciones), archivo `script.sql` con la creación de las tablas y datos de prueba, y servidor Node.js con la conexión a MySQL (`modulos/mysql.js`).
4. Backend: registro e inicio de sesión de usuarios con dos roles (jugador y administrador), y acceso al panel de administrador solo para el administrador.
5. Frontend: estructura del proyecto en Next.js, pantallas de registro e inicio de sesión conectadas al servidor con fetch, y manejo de la sesión del usuario (a qué pantallas puede entrar según su rol).
6. Backend: crear, consultar, modificar y eliminar categorías y frases sugeridas; eliminar pasos inapropiados de los álbumes (moderación); bloquear y desbloquear usuarios.
7. Frontend: panel de administrador con pantallas para gestionar categorías y frases, moderar contenido y bloquear o desbloquear usuarios.
8. Backend con WebSockets: crear una sala con un código, unirse a una sala con ese código, mostrar la lista de jugadores conectados y permitir que el anfitrión inicie la partida. Dejar definida la lista de mensajes (eventos) que se envían entre el cliente y el servidor.
9. Frontend: hook `useSocket` para conectarse al servidor por WebSocket, pantalla de lobby (crear una sala o unirse con un código) y sala de espera (lista de jugadores y botón para iniciar la partida).
10. Frontend: componente Pizarra (canvas de HTML5) para dibujar con mouse o con el dedo, con selector de colores, grosor del trazo, borrador, deshacer y exportación del dibujo como imagen.
11. Backend: lógica de las rondas. Después de que todos escriben su frase, en cada ronda cada jugador recibe el álbum de otro jugador para dibujar la frase o describir el dibujo, hasta completar todas las rondas.
12. Backend: temporizador de cada ronda, cierre automático de la ronda cuando termina el tiempo y manejo de jugadores desconectados (su paso queda como "sin respuesta" y la partida continúa).
13. Frontend: pantallas de la partida para escribir la frase, dibujar (usando la Pizarra) y describir un dibujo, con el temporizador a la vista y una pantalla de espera mientras los demás terminan.
14. Guardar en MySQL las partidas, los álbumes y sus pasos cuando termina cada partida, y mostrar al usuario los álbumes de sus partidas anteriores (backend y frontend).
15. Revelación final: el servidor envía a todos los jugadores, al mismo tiempo y paso a paso, cada álbum, y una pantalla muestra cómo se fue transformando la frase original (backend y frontend).
16. Aplicar la identidad visual definida (colores, tipografía y botones) a todas las pantallas (partida, pizarra, revelación, lobby y panel de administrador) y hacer que se vean bien en celulares.
17. Probar la aplicación con varios jugadores al mismo tiempo (desde distintas computadoras y celulares), corregir los errores encontrados y actualizar el DER y el README con lo que quedó implementado.
18. Preparar la presentación de la Expo Pio: ensayar la demostración, crear el usuario administrador para los docentes y organizar los turnos de atención del stand.
---
 
## Responsabilidades
 
Cuando una tarea tiene varias partes, se indica quién hace cada una.
 
### Brizuela
 
- **T3:** crear el servidor Node.js con la conexión a MySQL (`modulos/mysql.js`).
- **T8:** salas con WebSockets (crear sala con código, unirse, lista de jugadores e inicio de partida por el anfitrión) y definir la lista de eventos entre cliente y servidor.
- **T10:** componente Pizarra (dibujo con mouse o dedo, colores, grosor, borrador, deshacer y exportación como imagen).
- **T11:** lógica de las rondas (entrega del álbum de otro jugador en cada ronda).
- **T12:** temporizador, cierre de ronda y manejo de jugadores desconectados.
- **T14:** guardar la partida en MySQL al terminar, usando las funciones que arma Romano.
- **T15:** envío de la revelación a todos los jugadores, paso a paso (backend).
- **T17:** pruebas con varios jugadores y dispositivos, y corrección de errores.
### Romano
 
- **T2 (parte 1):** bocetos de las pantallas en Canva e identidad visual, terminados como límite el jueves 08/10.
- **T4:** registro, inicio de sesión y roles de usuario.
- **T6:** crear, consultar, modificar y eliminar categorías y frases sugeridas, moderación de pasos y bloqueo de usuarios.
- **T14:** funciones para guardar y consultar partidas, álbumes y pasos en MySQL, rutas del servidor para pedir los álbumes de partidas anteriores y pantalla "Mis álbumes anteriores".
- **T16:** estilos finales del panel de administrador y de la pantalla de álbumes.
- **T17 y T18:** actualizar el DER y el README, crear el usuario administrador para los docentes, probar la aplicación en varios dispositivos y ensayar la demostración.
### Leonardi
 
- **T1:** crear y configurar el repositorio (realizada el 05/10).
- **T2 (parte 2):** CSS global (`globals.css`) con los colores, la tipografía, los botones y los formularios compartidos por todas las pantallas, a partir de los bocetos de Canva.
- **T3:** `script.sql` con las tablas y los datos de prueba, a partir del DER.
- **T7:** panel de administrador.
- **T13:** pantallas para escribir la frase, describir y dibujar (usando la Pizarra).
- **T15:** completar la pantalla de revelación (mostrar cada álbum paso a paso) y conectarla con los mensajes que envía el servidor.
- **T16:** estilos finales de la pizarra y adaptación a celulares.
- **T17:** ajustes visuales y pruebas en celulares.
### Carucci
 
- **T3:** DER.
- **T5:** estructura de Next.js, pantallas de registro e inicio de sesión conectadas al servidor y manejo de la sesión según el rol.
- **T9:** hook `useSocket`, lobby y sala de espera.
- **T13:** conectar las pantallas de la partida con las rondas, temporizador a la vista y espera entre rondas.
- **T15:** estructura de la pantalla de revelación y navegación entre pasos.
- **T16:** estilos finales de lobby, partida y revelación.
- **T17:** ajustes visuales y revisión en celulares.
- **T18:** demostración y turnos de atención del stand.
---
 
## Planificación
 
Las fechas corresponden a días de clase del proyecto: lunes y miércoles (2 clases cada día) y jueves (1 clase). No se consideran los feriados del lunes 12/10 y del lunes 09/11. La fecha estimada es la de finalización de cada objetivo.
 
| N° | Objetivo | Tareas asociadas | Responsables | Fecha estimada |
| --- | --- | --- | --- | --- |
| 1 | Organizar el repositorio | T1: crear el repositorio en GitHub con las carpetas `frontend`, `backend` y `docs`, el `.gitignore`, el Team del grupo y el README | Leonardi | Lun 05/10 |
| 2 | Definir el diseño visual (Canva) | T2 (parte 1): bocetos de todas las pantallas en Canva con la paleta de colores y la tipografía (identidad visual) | Romano | Jue 08/10 |
| 3 | Estilos base (CSS global) | T2 (parte 2): archivo `globals.css` con los colores (definidos como variables para poder ajustarlos fácil), la tipografía, los botones y los formularios compartidos por todas las pantallas, a partir de la paleta y la tipografía de los bocetos | Leonardi | Jue 08/10 |
| 4 | Preparar la base del sistema | T3: diseñar el DER (Carucci), crear `script.sql` con las tablas y datos de prueba (Leonardi) y crear el servidor Node.js con la conexión a MySQL (Brizuela) | Carucci, Leonardi, Brizuela | Mié 14/10 |
| 5 | Salas en tiempo real (back) | T8: crear sala con código, unirse con el código, lista de jugadores, inicio de partida por el anfitrión y lista de eventos entre cliente y servidor | Brizuela | Mié 14/10 |
| 6 | Autenticación (back) | T4: registro e inicio de sesión con los roles jugador y administrador, y acceso al panel solo para el administrador | Romano | Lun 19/10 |
| 7 | Autenticación (front) | T5: estructura de Next.js, pantallas de registro e inicio de sesión conectadas al servidor y manejo de la sesión según el rol | Carucci | Mié 21/10 |
| 8 | Administración (back) | T6: crear, consultar, modificar y eliminar categorías y frases sugeridas, eliminar pasos inapropiados y bloquear o desbloquear usuarios | Romano | Mié 21/10 |
| 9 | Administración (front) | T7: panel de administrador para gestionar categorías, frases, moderación y usuarios | Leonardi | Jue 22/10 |
| | **HITO 1** | **Base del sistema: repositorio, base de datos, inicio de sesión con roles y panel de administrador funcionando** | **Todos** | **Jue 22/10** |
| 10 | Lógica de la partida | T11: en cada ronda, entregar a cada jugador el álbum de otro para dibujar la frase o describir el dibujo | Brizuela | Lun 26/10 |
| 11 | Pizarra de dibujo | T10: dibujo con mouse o dedo, colores, grosor, borrador, deshacer y exportación como imagen | Brizuela | Mié 28/10 |
| 12 | Salas en tiempo real (front) | T9: `useSocket`, lobby (crear o unirse a una sala), sala de espera e inicio de partida | Carucci | Jue 29/10 |
| 13 | Control de rondas | T12: temporizador por ronda, cierre al terminar el tiempo y jugadores desconectados (su paso queda "sin respuesta") | Brizuela | Lun 02/11 |
| 14 | Guardado y consulta de partidas (back) | T14: funciones para guardar y consultar partidas, álbumes y pasos en MySQL, y rutas del servidor para pedir los álbumes de partidas anteriores | Romano | Mié 04/11 |
| 15 | Pantallas de partida | T13: pantallas para escribir la frase, dibujar y describir, con el temporizador a la vista y espera entre rondas | Leonardi, Carucci | Mié 04/11 |
| | **HITO 2** | **Partida completa en tiempo real: salas, pizarra y rondas con temporizador, funcionando con varios jugadores desde distintos navegadores** | **Todos** | **Jue 05/11** |
| 16 | Consulta de álbumes anteriores (front) | T14: pantalla "Mis álbumes anteriores" con las partidas del usuario y sus álbumes | Romano | Mié 11/11 |
| 17 | Revelación de álbumes | T15: el servidor envía cada álbum paso a paso a todos los jugadores a la vez y una pantalla lo muestra | Brizuela, Carucci, Leonardi | Jue 12/11 |
| 18 | Guardado al terminar la partida | T14: guardar automáticamente en MySQL la partida, los álbumes y sus pasos cuando termina, y corregir los errores que aparezcan | Brizuela | Lun 16/11 |
| 19 | Estilos finales | T16: aplicar la identidad visual a todas las pantallas y adaptarlas a celulares | Carucci, Leonardi, Romano | Lun 16/11 |
| | **HITO 3** | **Versión completa y funcional de la aplicación** | **Todos** | **Lun 16/11** |
| 20 | Pruebas y cierre | T17: probar con varios jugadores y dispositivos al mismo tiempo, corregir errores y ajustar detalles visuales | Brizuela, Leonardi, Carucci | Jue 19/11 |
| 21 | Documentación y presentación | T17 y T18: actualizar el DER y el README, crear el usuario administrador para los docentes, ensayar la demostración y organizar los turnos del stand | Romano, Carucci | Jue 19/11 |
| | **EXPO PIO** | **Presentación final** | **Todos** | **Vie 20/11** |
---
 
## Entregables
 
### Primer entregable (22/10)
 
Repositorio organizado, base de datos con DER y `script.sql`, estructura base de frontend y backend, registro y login con roles, y panel de administrador con gestión de frases, moderación y bloqueo de usuarios.
 
### Segundo entregable (05/11)
 
Partida completa en tiempo real: salas con código, pizarra de dibujo y rondas de escribir, dibujar y describir con temporizador, funcionando con varios jugadores.
 
### Entrega final (16/11)
 
Revelación sincronizada de álbumes, guardado y consulta de partidas anteriores, estilos aplicados en todas las pantallas, y aplicación completa, funcional y ejecutable. Presentación en la Expo Pio el 20/11.
