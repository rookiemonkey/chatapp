const setLocation = (message, sender) => {
    return {
        sender,
        type: 'new_location',
        location: message,
        timestamp: new Date().getTime()
    }
}

module.exports = setLocation;