const setUser = (room, users) => {
    return {
        room,
        users,
        timestamp: new Date().getTime()
    }
}

module.exports = setUser