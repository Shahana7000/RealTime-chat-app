const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const PORT = 8000;

const users = {};

app.use(express.static('public')); // Serve frontend files

io.on('connection', socket => {
    console.log('New user connected');

    // Save the new user's name
    socket.on('new-user-join', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // Broadcast message with name
    socket.on('send', message => {
        socket.broadcast.emit('receive', {
            message: message,
            user: users[socket.id]
        });
    });

    // User leaves
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-left', users[socket.id]);
        delete users[socket.id];
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
