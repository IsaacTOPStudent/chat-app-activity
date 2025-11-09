# Chat en Tiempo Real (Node.js + Socket.IO)

Este proyecto es un chat simple construido con Node.js, Express y Socket.IO. En la versión actual los mensajes se guardan en una base de datos SQLite, se entrega historial a usuarios que se unen y se aplican límites y validaciones básicas en el servidor.

---

## Qué hay de nuevo (resumen)

- Persistencia de mensajes en SQLite (archivo chat.db).
- El servidor envía el historial reciente al usuario que se une.
- Límite de longitud por mensaje (1000 caracteres). Si un mensaje excede el límite, se trunca y el cliente recibe un evento `message truncated`.
- Mensajes vacíos no permitidos; el cliente recibe `message error` si intenta enviar uno.
- Límite de historial cargado al unirse (máximo 200 mensajes por defecto).
- Eventos `user joined` y `user left` incluyen el conteo actual de usuarios y la lista de nombres.
- Endpoint de comprobación de estado: `GET /health`.
- Soporte de puerto dinámico mediante la variable de entorno `PORT` (útil para despliegues en la nube).

---

## Tecnologías Utilizadas

* Node.js
* Express.js
* Socket.IO
* SQLite (sqlite3)
* HTML5, CSS3, JS (cliente)

---

## Requisitos Previos

Asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión moderna)
- npm (viene con Node.js)
- Para inspeccionar la base de datos localmente (opcional): la herramienta `sqlite3` o cualquier visor de SQLite.

Verifica Node.js:

```bash
node -v
```

---

## Instalación y Uso

Sigue estos pasos para ejecutar el proyecto en tu máquina local.

1. Clona el repositorio:

```bash
git clone https://github.com/IsaacTOPStudent/chat-app-activity.git
```

2. Navega a la carpeta del proyecto:

```bash
cd chat-app-activity
```

3. Instala las dependencias (incluye sqlite3):

```bash
npm install
```

4. Inicia el servidor:

- Desarrollo local (puerto por defecto 3000):

```bash
node server.js
```

- Usar un puerto distinto (por ejemplo 8080):

```bash
PORT=8080 node server.js
```

5. Abre el chat en tu navegador:

```
http://localhost:3000
```

6. Health check (útil para monitores/PLATAFORMAS):

```
GET http://localhost:3000/health
```

Respuesta esperada: JSON con { status: 'ok', uptime: <segundos> }.

---

## Estructura del Proyecto

```
chat-app-activity/
│
├── server.js           # Servidor Node.js con Express, Socket.IO y persistencia SQLite
├── package.json        # Dependencias del proyecto (incluye sqlite3)
├── package-lock.json   # Lock file de npm
├── chat.db             # (Creado automáticamente) Base de datos SQLite con mensajes
│
└── public/             # Archivos estáticos del cliente
    ├── index.html      # Interfaz del chat
    ├── style.css       # Estilos del chat
    └── client.js       # Lógica del cliente con Socket.IO
```

Nota: `chat.db` se crea automáticamente la primera vez que se inicia el servidor si no existe.

---

## Funcionalidades (detalladas)

- Comunicación en tiempo real mediante Socket.IO.
- Persistencia de mensajes en SQLite para que el historial sea persistente entre reinicios del servidor.
- Al unirse, el cliente recibe hasta N mensajes recientes (configurado en servidor como MAX_HISTORY, 200 por defecto).
- Límite de longitud por mensaje (MAX_MESSAGE_LENGTH, 1000 por defecto); si se excede, el mensaje se trunca y el cliente recibe `message truncated`.
- Mensajes vacíos rechazados; el servidor emite `message error` al remitente.
- Los nombres de usuario se normalizan y se limitan a 32 caracteres; si el usuario no proporciona nombre, se asigna `UserXYZ`.
- Eventos globales:
  - `history` — historial entregado al cliente que se une.
  - `user joined` — notifica cuándo alguien entra; incluye nombre, `userCount` y `users` (lista de nombres).
  - `user left` — notifica cuándo alguien sale; incluye nombre, `userCount` y `users`.
  - `chat message` — mensaje nuevo enviado a todos.
  - `message truncated` — notifica al remitente si su mensaje fue truncado.
  - `message error` — notifica errores de envío (p. ej. mensaje vacío).
- Endpoint `GET /health` para comprobar estado y uptime del servidor.

---

## Personalización y Configuración

- Cambiar el puerto: establecer la variable de entorno `PORT` o editar `server.js` si es necesario.
- Cambiar límites: editar las constantes en `server.js`:
  - `MAX_MESSAGE_LENGTH` (por defecto 1000)
  - `MAX_HISTORY` (por defecto 200)
- Ver/inspeccionar la base de datos local:
  - Con sqlite3 instalado:
    ```bash
    sqlite3 chat.db
    sqlite> .tables
    sqlite> SELECT id, name, text, datetime(ts/1000, 'unixepoch') FROM messages ORDER BY ts DESC LIMIT 20;
    ```

---

## Notas de Producción

- Actualmente no hay autenticación: cualquier persona puede elegir un nombre y unirse.
- Validación básica en servidor: no confíes únicamente en el cliente.
- Considera para producción:
  - Autenticación y autorización.
  - Sanitización/escape de contenido para evitar XSS en el cliente.
  - Backups y retención/expurgo de mensajes en la base de datos.
  - Usar una base de datos gestionada si esperas gran volumen.

---

## Contribuciones

Las contribuciones son bienvenidas. Flujo sugerido:

1. Haz un fork del proyecto.
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`).
3. Haz commit de tus cambios (`git commit -m 'Agrega nueva funcionalidad'`).
4. Push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

---

## Licencia

Este proyecto está disponible bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

---

## Autor

**IsaacTOPStudent**
- GitHub: https://github.com/IsaacTOPStudent

---

## Agradecimientos

- [Socket.IO](https://socket.io/)
- [Express.js](https://expressjs.com/)
- [Node.js](https://nodejs.org/)

---

¡Disfruta tu chat en tiempo real!
```
