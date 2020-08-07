const setLocation = message => {
    return {
        type: 'new_location',
        location: message,
        timestamp: new Date().getTime()
    }
}

module.exports = setLocation;