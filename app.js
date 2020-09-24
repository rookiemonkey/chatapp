// ======================================
// DEPENDENCIES
// ======================================
const Filter = require('bad-words')
const express = require('express');
const app = express();

const http = require('http');
const { join } = require('path');
const server = http.createServer(app);

const socketio = require('socket.io');
const io = socketio(server);

const utilities = require('./utils')
const { setAlert, setLocation, setNewMessage, setUser, UserUtils, getRooms } = utilities;
const { addUser, removeUser, getUser, getUsers } = UserUtils;

app.use(express.static("public"));

// ======================================
// ROUTES
// ======================================
app.get('/', (req, res) => {
    res.render('index.html')
})

io.on('connection', socket => {

    socket.on('index', () => {
        const rooms = getRooms();
        socket.emit('rooms', rooms);

    })

    socket.on('join', ({ username, room, room_selected }, acknowledgeMessage) => {
        let joinTheUserHere;

        !room_selected && !room
            ? acknowledgeMessage({ error: 'Please choose a room to join' })
            : null

        room_selected
            ? joinTheUserHere = room_selected
            : joinTheUserHere = room;

        const { error, user } = addUser({ id: socket.id, username, room: joinTheUserHere })
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