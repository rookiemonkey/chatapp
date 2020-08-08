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
const { setAlert, setLocation, setNewMessage, setUser, UserUtils } = utilities;
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
        io.to(user.room).emit('onRoom', setUser(user.room, getUsers(user.room)))
        socket.broadcast.to(user.room).emit('message', setAlert(`${user.username} has joined the room`))
    })

    socket.on('newMessage', (newMessage, acknowledgeMessage) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if (user.error) { return acknowledgeMessage({ error: user.error }) }

        if (filter.isProfane(newMessage)) {
            return acknowledgeMessage({ error: 'Profanity not allowed' })
        }

        if (newMessage === '') {
            return acknowledgeMessage({ error: 'It would be best if we can say something' })
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
        const { username, room } = leftUser
        if (leftUser) {
            io.to(room).emit('message', setAlert(`${username} has left`))
            io.to(room).emit('onRoom', setUser(room, getUsers(room)))
        }
    })
})

module.exports = server