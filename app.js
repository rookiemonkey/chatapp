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
const { setAlert, setLocation, setNewMessage, UserUtils } = utilities;
const { addUser, removeUser, getUser, getUsers } = UserUtils;

app.use(express.static("public"));

// ======================================
// ROUTES
// ======================================
app.get('/', (req, res) => {
    res.render('index.html')
})

io.on('connection', socket => {

    socket.on('join', ({ username, room }, acknowledgeMessage) => {
        const { error, user } = addUser({ id: socket.id, username, room })
        if (error) { return acknowledgeMessage({ error }) }

        socket.join(user.room)
        socket.emit('message', setAlert('Welcome!'))
        socket.broadcast.to(user.room).emit('message', setAlert(`${user.username} has joined the room`))

        const alert = `Successfully joined ${user.room}`
        acknowledgeMessage({ alert })
    })

    socket.on('newMessage', (newMessage, acknowledgeMessage) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if (user.error) { return acknowledgeMessage({ error: user.error }) }

        if (filter.isProfane(newMessage)) {
            return acknowledgeMessage({ error: 'Profanity not allowed' })
        }

        acknowledgeMessage(false)
        io.to(user.room).emit('message', setNewMessage(newMessage, user.username))
    })

    socket.on('location', (location, acknowledgeMessage) => {
        const user = getUser(socket.id)

        if (user.error) { return acknowledgeMessage({ error: user.error }) }

        io.to(user.room).emit('message', setLocation(location, user.username))
        acknowledgeMessage({ alert: 'Location sucessfully shared' })
    })

    socket.on('disconnect', () => {
        const leftUser = removeUser(socket.id)
        if (leftUser) { io.to(leftUser.room).emit('message', setAlert(`${leftUser.username} has left`)) }
    })
})

module.exports = server