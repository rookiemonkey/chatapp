const emitMessage = (message, sender) => {
    return {
        sender,
        type: 'new_message',
        message,
        timestamp: new Date().getTime()
    }
}

module.exports = emitMessage;