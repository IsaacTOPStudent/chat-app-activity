// public/client.js
// Cliente que se conecta por Socket.io.
// - pide un nombre, envía 'join'
// - valida longitud antes de enviar
// - no inserta HTML peligroso en el DOM (usa textContent)
// - maneja eventos: history, chat message, user joined/left

const socket = io()

const form = document.querySelector('.form-chat');
const input = document.querySelector('.input-form-chat');
const messages = document.querySelector('.messages');
// Selectors corrected to match index.html (id="user-count" and class="user-list")
const userCountEl = document.getElementById('user-count');
const usersListEl = document.querySelector('.user-list');

const MAX_MESSAGE_LENGTH = 1000;

//obtener o pedir el nombre del localStorage
let username = localStorage.getItem('chat-username')  || '';
if(!username) {
    username = prompt('Introduce your name: ') || `User${Math.floor(Math.random() * 1000)}`;
    username = username.slice(0, 32);
    localStorage.setItem('chat-username', username); 
}
//informar al servidor del join
socket.emit('join', username);

//manejar el historial
socket.on('history', (history) => {
    history.forEach(entry => {
        addMessage(entry, entry.name === username ? 'my-message' : 'other-message');
    });
});

//Manejar mensajes entrantes broadcast
socket.on('chat message', (msg) => {
    addMessage(msg, msg.name === username ? 'my-message' : 'other-message');
});

// Notificaciones de usuario conectado/desconectado
socket.on('user joined', (data) => {
    showNotification(`${data.name} se ha unido. (${data.userCount} online)` );
    updateUserList(data.users, data.userCount);
});

socket.on('user left', (data) => {
    showNotification(`${data.name} se ha ido. (${data.userCount} offline)` );
    updateUserList(data.users, data.userCount);
});

socket.on('message truncated',(info) => {
    showNotification(`Tu mensaje fue truncado a ${info.allowed} caracteres.`);
});

//enviar mensaje (validación en cliente)
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value && input.value.trim();
    if(!text) return;

    if(text.length > MAX_MESSAGE_LENGTH) {
        showNotification(`Tu mensaje excede el límite de ${MAX_MESSAGE_LENGTH} caracteres.`);
        return;
    }

    //emitir al servidor, validará y broadcasteará
    socket.emit('chat message', {text, name: username});

    //Limpiar input
    input.value = '';
});

//Añadir elemento de mensaje al DOM de forma segura (NO usar innerHTML)

function addMessage(msg, type = 'other-message') {
    const li = document.createElement('li');

    const header = document.createElement('div');
    header.className = 'message-header';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'message-name';

    //user textcontent para prevenir ejecución de HTML
    nameSpan.textContent = msg.name || 'Anonymous';

    const timeSpan = document.createElement('span');
    timeSpan.className = 'message-time';
    const d = msg.ts ? new Date(msg.ts) : new Date();
    timeSpan.textContent = d.toLocaleTimeString();

    header.appendChild(nameSpan);
    header.appendChild(timeSpan);

    const textSpan = document.createElement('div');
    textSpan.className = 'message-text';
    textSpan.textContent = msg.text;

    li.appendChild(header);
    li.appendChild(textSpan);
    li.classList.add(type);

    messages.appendChild(li);

    //scroll al final
    messages.scrollTop = messages.scrollHeight;
}

function showNotification(text) {
    const li = document.createElement('li');
    li.className = 'notification';
    li.textContent = text;
    messages.appendChild(li);
    messages.scrollTop = messages.scrollHeight;
    
    // Auto-remover la notificación después de 3 segundos
    setTimeout(() => {
        if (li.parentNode) {
            li.style.transition = 'opacity 0.3s';
            li.style.opacity = '0';
            setTimeout(() => li.remove(), 300);
        }
    }, 3000);
}

function updateUserList(users, count) {
    if(userCountEl) userCountEl.textContent = `Conectados: ${count}`;
    if(usersListEl) {
        usersListEl.innerHTML = '';
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = user;
            usersListEl.appendChild(li);
        });
    }
}

