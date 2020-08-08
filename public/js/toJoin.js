socket.emit('join', { username, room }, ackMessageFromServer => {
    if (ackMessageFromServer.error) {
        alert(ackMessageFromServer.error)
        location.href = '/'
    }

    alert(ackMessageFromServer.alert)
})