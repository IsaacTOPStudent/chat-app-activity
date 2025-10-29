# Chat en Tiempo Real (Node.js + Socket.IO)

Este es un proyecto de chat simple construido con Node.js, Express y Socket.IO. Permite a múltiples usuarios unirse, elegir un nombre y conversar en tiempo real. Los mensajes se distinguen visualmente, alineándose a la derecha para el usuario propio y a la izquierda para los demás.

---

## Tecnologías Utilizadas

* **Node.js:** Entorno de ejecución del servidor.
* **Express.js:** Para servir los archivos estáticos (HTML, CSS, JS).
* **Socket.IO:** Para la comunicación bidireccional y en tiempo real (WebSockets).
* **HTML5, CSS3, JS (Cliente):** La interfaz de usuario del chat.

---

## Instalación y Uso

Sigue estos pasos para ejecutar el proyecto en tu máquina local.

### Prerrequisitos

Asegúrate de tener [Node.js](https://nodejs.org/) instalado en tu sistema. Puedes verificarlo con:

```bash
node -v
```


### Pasos de Instalación

#### 1. Clona el repositorio

```bash
git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git
```

*(O descarga el ZIP y descomprímelo)*

#### 2. Navega a la carpeta del proyecto

```bash
cd nombre-de-la-carpeta-del-chat
```

#### 3. Instala las dependencias

Esto leerá el `package.json` e instalará `express` y `socket.io`.

```bash
npm install
```

#### 4. Inicia el servidor

```bash
node server.js
```

#### 5. Abre el chat en tu navegador

Una vez que el servidor esté corriendo, abre tu navegador y ve a:

```
http://localhost:3000
```

---

##  Estructura del Proyecto

```
proyecto-chat/
│
├── server.js           # Servidor Node.js con Express y Socket.IO
├── package.json        # Dependencias del proyecto
├── package-lock.json   # Lock file de npm
│
└── public/             # Archivos estáticos del cliente
    ├── index.html      # Interfaz del chat
    ├── style.css       # Estilos del chat
    └── client.js       # Lógica del cliente con Socket.IO
```

---

## Funcionalidades

-  Conexión en tiempo real con Socket.IO
-  Los usuarios pueden elegir su nombre al unirse
-  Mensajes alineados a la derecha para el usuario actual
-  Mensajes alineados a la izquierda para otros usuarios
-  Notificaciones cuando alguien se conecta o desconecta
-  Interfaz simple y responsive

---

## 🛠️ Personalización

### Cambiar el puerto del servidor

Edita `server.js` y cambia el puerto:

```javascript
const PORT = 3000; // Cambia este número
```

### Modificar estilos

Edita `public/style.css` para personalizar colores, fuentes y diseño.

---

##  Notas

- Este chat **no guarda historial** de mensajes. Cuando recargas la página, pierdes los mensajes anteriores.
- Los mensajes **no se almacenan en base de datos**. Todo funciona en memoria mientras el servidor esté activo.
- Para producción, considera agregar autenticación, base de datos y validación de entrada.

---

##  Contribuciones

Las contribuciones son bienvenidas. Si encuentras algún bug o tienes ideas de mejora:

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## Licencia

Este proyecto es de código abierto y está disponible bajo la [Licencia MIT](LICENSE).

---

##  Autor

**Tu Nombre**
- GitHub: [@TU_USUARIO](https://github.com/TU_USUARIO)

---

##  Agradecimientos

- [Socket.IO](https://socket.io/) por la librería de WebSockets
- [Express.js](https://expressjs.com/) por el framework web
- [Node.js](https://nodejs.org/) por el entorno de ejecución

---

¡Disfruta tu chat en tiempo real! 
