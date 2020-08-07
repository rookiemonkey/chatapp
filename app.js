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

    socket.emit('message', {
        type: 'new_alert',
        alert: `Welcome`
    })

    socket.broadcast.emit('message', {
        type: 'new_alert',
        alert: 'A new user has joined the chat'
    })

    socket.on('newMessage', (newMessage, acknowledgeMessage) => {
        const filter = new Filter()

        if (filter.isProfane(newMessage)) {
            return acknowledgeMessage('Profanity not allowed')
        }

        io.emit('message', {
            type: 'new_message',
            message: newMessage
        })
        acknowledgeMessage(false)
    })

    socket.on('location', (location, acknowledgeMessage) => {
        io.emit('message', {
            type: 'new_location',
            location: location
        })
        acknowledgeMessage('from server: Location sucessfully shared')
    })

    socket.on('disconnect', () => {
        io.emit('message', {
            type: 'new_alert',
            alert: `A user left the chat`
        })
    })
})

module.exports = server