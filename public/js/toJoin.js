socket.emit('join', { username, room }, ackMessageFromServer => {
    if (ackMessageFromServer.error) {
        alert(ackMessageFromServer.error)
        return location.href = '/'
    }
})