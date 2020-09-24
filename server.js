const socketio = require('socket.io');
const server = require('./app');

server.listen(process.env.PORT || 3030, () => {
    if (process.env.PORT) { console.log(`Server started at PORT:${process.env.PORT}`) }
    console.log('Server started at http://localhost:3030')
})
