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

const utilities = require('./utils')
const { setAlert, setLocation, setNewMessage } = utilities;

app.use(express.static("public"));

// ======================================
// ROUTES
// ======================================
app.get('/', (req, res) => {
    res.render('index.html')
})

io.on('connection', socket => {

    socket.emit('message', setAlert('Welcome!'))

    socket.broadcast.emit('message', setAlert('A new user has joined'))

    socket.on('newMessage', (newMessage, acknowledgeMessage) => {
        const filter = new Filter()

        if (filter.isProfane(newMessage)) {
            return acknowledgeMessage('Profanity not allowed')
        }

        io.emit('message', setNewMessage(newMessage))
        acknowledgeMessage(false)
    })

    socket.on('location', (location, acknowledgeMessage) => {
        io.emit('message', setLocation(location))
        acknowledgeMessage('from server: Location sucessfully shared')
    })

    socket.on('disconnect', () => {
        io.emit('message', setAlert('a user has left'))
    })
})

module.exports = server