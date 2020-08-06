// ======================================
// DEPENDENCIES
// ======================================
const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const socketio = require('socket.io');
const { disconnect } = require('process');
const io = socketio(server);

app.use(express.static("public"));

// ======================================
// ROUTES
// ======================================
app.get('/', (req, res) => {
    res.render('index.html')
})

io.on('connection', socket => {

    socket.emit('message', 'Welcome!')
    socket.broadcast.emit('message', 'a new user has joined the chat')

    socket.on('newMessage', newMessage => {
        io.emit('message', newMessage)
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user left the chat')
    })
})

module.exports = server