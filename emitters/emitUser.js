const emitUser = (room, users) => {
    return {
        room,
        users,
        timestamp: new Date().getTime()
    }
}

module.exports = emitUser