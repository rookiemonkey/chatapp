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

    socket.on('join', ({ username, room }) => {
        socket.join(room)
        socket.emit('message', setAlert('Welcome!'))
        socket.broadcast.to(room).emit('message', setAlert(`${username} has joined the room`))

    })

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
        io.emit('message', setAlert('A user has left'))
    })
})

module.exports = server