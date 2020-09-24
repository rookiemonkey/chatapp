socket.emit('join', { username, room, room_selected }, ackMessageFromServer => {
    if (ackMessageFromServer.error) {
        alert(ackMessageFromServer.error)
        return location.href = '/'
    }
})