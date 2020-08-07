const setNewMessage = message => {
    return {
        type: 'new_message',
        message,
        timestamp: new Date().getTime()
    }
}

module.exports = setNewMessage;