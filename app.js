// ======================================
// DEPENDENCIES
// ======================================
const Filter = require('bad-words')
const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server)

const emitAlert = require('./emitters/emitAlert');
const emitLocation = require('./emitters/emitLocation');
const emitMessage = require('./emitters/emitMessage');
const emitUser = require('./emitters/emitUser');
const getRooms = require('./utils/getRooms');
const { addUser, removeUser, getUser, getUsers } = require('./utils/Users');

app.use(express.static("public"));

// ======================================
// ROUTES
// ======================================
app.get('/', (req, res) => {
    res.render('index.html')
})


io.on('connection', socket => {


    /**
     * !EVENT: 'index'
     * !Initial load of the page
     */
    socket.on('index', () => {
        const rooms = getRooms();
        socket.emit('rooms', rooms);

    })



    /**
     * !EVENT: 'join'
     * !A user joins a room
     */
    socket.on('join', ({ username, room, room_selected }, acknowledgeMessage) => {
        let joinTheUserHere;

        if (!room_selected && !room) {
            return acknowledgeMessage({ error: 'Please choose a room to join' })
        }

        if (room_selected) {
            joinTheUserHere = room_selected
        } else {
            joinTheUserHere = room;
        }

        const { error, user } = addUser({ id: socket.id, username, room: joinTheUserHere })

        if (error) {
            return acknowledgeMessage({ error })
        }

        socket.join(user.room)

        // welcome message to the client upon entering the chat room
        socket.emit('message', emitAlert('Welcome!'))

        // broadcast message to all even the current socket/user for the sidebar online users
        io
            .to(user.room)
            .emit('onRoom', emitUser(user.room, getUsers(user.room)))

        // broadcast message to other clients in the same room exectp the current socket/user
        socket.broadcast
            .to(user.room)
            .emit('message', emitAlert(`${user.username} has joined the room`))
    })



    /**
     * !EVENT: 'newMessage'
     * !when a user sends a message to a room
     */
    socket.on('newMessage', (newMessage, acknowledgeMessage) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if (user.error) {
            return acknowledgeMessage({ error: user.error })
        }

        if (filter.isProfane(newMessage)) {
            return acknowledgeMessage({ error: 'Profanity not allowed' })
        }

        if (!newMessage) {
            return acknowledgeMessage({ error: 'It would be best if we can say something' })
        }

        acknowledgeMessage(false)

        // broadcast message to everyone inside the room
        io
            .to(user.room)
            .emit('message', emitMessage(newMessage, user.username))
    })



    /**
    * !EVENT: 'location'
    * !when a user sends their location
    */
    socket.on('location', (location, acknowledgeMessage) => {
        const user = getUser(socket.id)

        if (user.error) {
            return acknowledgeMessage({ error: user.error });
        }

        // broadcast message to everyone inside the room
        io
            .to(user.room)
            .emit('message', emitLocation(location, user.username))
    })



    /**
    * !EVENT: 'disconnect'
    * !when a user left the chat room
    */
    socket.on('disconnect', () => {
        const leftUser = removeUser(socket.id)
        const { username, room } = leftUser;
        if (leftUser) {

            // broadbcast message to everyone inside the room and update the sidebar
            io.to(room).emit('message', emitAlert(`${username} has left the room`))
            io.to(room).emit('onRoom', emitUser(room, getUsers(room)))
        }
    })
})

module.exports = server