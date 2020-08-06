// ======================================
// DEPENDENCIES
// ======================================
const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const socketio = require('socket.io');
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

    socket.on('newMessage', newMessage => {
        io.emit('newMessage', newMessage)
    })
})

module.exports = server