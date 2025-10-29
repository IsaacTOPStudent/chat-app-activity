// const fs = require('fs')
const http = require('http');
const express = require('express');
const {Server} = require("socket.io");
const path = require('path');

const port = 3000;
const app = express();
const server1 = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));

// const server = http.createServer((req, res) => {

//     if(req.url === '/') {
//         fs.readFile(__dirname + '/index.html', (err, data) => {
//             if(err) {
//                 res.writeHead(500)
//                 return res.end('Error downloading index.html');

//             }
//             res.writeHead(200, {
//                 'Content-Type': 'text/html'
//             });
//             res.end(data);

//         })
//     } else if(req.url === '/client.js') {
//         fs.readFile(__dirname + '/client.js', (err, data) => {
//             if(err) {
//                 res.writeHead(500);
//                 return res.end('Error downloanding client.js');
//             }
//             res.writeHead(200, {
//                 'Content-Type': 'application/javascript'
//             });
//             res.end(data);
//         })
//     } else {
//         res.writeHead(404);
//         res.end('Not found');
//     }
// });

const io = new Server(server1, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('New user in the server!!')
    
    socket.on('chat message', (msg) => {
        console.log(`Message from: ${msg.name} : ${msg.text}`);
        socket.broadcast.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User is been disconnected');
    });
});


server1.listen(port, () => {
    console.log(`Server listening on port: ${port}`)
})