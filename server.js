// server.js
// Servidor Node.js con Express + Socket.io y persistencia en SQLite
// Funciones principales:
//  - recibir eventos 'join' y 'chat message' desde clientes
//  - validar/truncar mensajes largos
//  - guardar mensajes en SQLite
//  - enviar historial al usuario que se une
//  - notificar a todos cuando un usuario se une o se va

// const fs = require('fs')
const http = require('http');
const express = require('express');
const {Server} = require("socket.io");
const path = require('path');
// Use the npm package 'sqlite3' (not a built-in). Ensure it's installed.
const sqlite3 = require('sqlite3').verbose();

// Use dynamic port for cloud environments (Render/Heroku/etc)
const port = process.env.PORT || 3000;
const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY = 200;

const app = express();
const server1 = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));

// Simple health check endpoint for uptime monitors
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

const io = new Server(server1, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST']
    }
});

// Configurar base de datos SQLite
const db =  new sqlite3.Database(path.join(__dirname, 'chat.db'), (err) => {
    if(err) {
        console.error('Error opening database: ', err);
        process.exit(1);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Crear tabla de mensajes si no existe
db.run(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL, 
        text TEXT NOT NULL,
        ts INTEGER
        )
    `, (err) => {
        if(err) console.error('Error creating messages table: ', err);
    }
);

const users = {};

function saveMessageToDB(entry) {
    const stmt = db.prepare('INSERT INTO messages (name, text, ts) VALUES (?, ?, ?)');
    stmt.run(entry.name, entry.text, entry.ts, (err) => {
        if(err) console.error('Error saving message to DB: ', err);
    });
    stmt.finalize();
}

function loadRecentMessages(limit, callback) {
    db.all('SELECT name, text, ts FROM messages ORDER BY ts DESC LIMIT ?', [limit], (err, rows) => {
        if(err) {
            console.error('Error searching messages history: ', err);
            return callback(err, []);
        } 
        callback(null, rows.reverse());
    });
}

io.on('connection', (socket) => {
    console.log('New connection: ', socket.id);
    
    socket.on('join', (username) => {

        const name = typeof username === 'string' && username.trim().length > 0
        ? username.trim().slice(0, 32) : `User${Math.floor(Math.random() * 1000)}`;

        users[socket.id] = name;
        console.log(`User registered: ${name} (Socket ID: ${socket.id})`);

        loadRecentMessages(MAX_HISTORY, (err, history) => {
            if(err) socket.emit('history', []);
            else socket.emit('history', history);
        });

        io.emit('user joined', {
            name, 
            userCount: Object.keys(users).length,
            users: Object.values(users)
        });
    });

    socket.on('chat message', (msg) => {

        const rawText = msg && typeof msg.text === 'string' ? msg.text : '';

        //no permitir mensajes vacíos
        if(!rawText || rawText.trim().length === 0) {
            socket.emit('message error', {reason: 'empty'});
            return;
        }

        // Truncar mensajes demasiado largos
        let finalText = rawText;
        if(rawText.length > MAX_MESSAGE_LENGTH) {
            finalText = rawText.slice(0, MAX_MESSAGE_LENGTH);

            //Avisar al usuario que su mensaje fue truncado
            socket.emit('message truncated', {allowed: MAX_MESSAGE_LENGTH});
            console.log(`Truncated message from ${rawText.length} to ${MAX_MESSAGE_LENGTH} chars`);
        }

        //construir el entry de mensaje
        const entry = {
            name: users[socket.id] || (msg && msg.name) || 'Anonymous',
            text: finalText,
            ts: Date.now()
        };

        //guardar en db
        saveMessageToDB(entry);

        //emitir a todos los usuarios
        io.emit('chat message', entry);
        console.log(`Broadcast message from ${entry.name} - ${entry.text}`);
    });

    // Manejar desconexiones
    socket.on('disconnect', () => {
        const name = users[socket.id];
        delete users[socket.id];
        console.log(`User disconnected: ${name} (Socket ID: ${socket.id})`);

        //notificar a todos que el usuario se ha ido
        io.emit('user left', {
            name: name || 'Anonymous',
            userCount: Object.keys(users).length,
            users: Object.values(users)
        });
    });
});


server1.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});