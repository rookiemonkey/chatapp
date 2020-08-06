// ======================================
// DEPENDENCIES
// ======================================
const Filter = require('bad-words')
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
    socket.broadcast.emit('message', 'a new user has joined the chat')

    socket.on('newMessage', (newMessage, acknowledgeMessage) => {
        const filter = new Filter()

        if (filter.isProfane(newMessage)) {
            return acknowledgeMessage('from server: bad-words are not allowed')
        }

        io.emit('message', newMessage)
    })

    socket.on('location', location => {
        socket.broadcast.emit('message', location)
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user left the chat')
    })
})

module.exports = server