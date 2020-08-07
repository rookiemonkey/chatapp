const setAlert = message => {
    return {
        type: 'new_alert',
        alert: message,
        timestamp: new Date().getTime()
    }
}

module.exports = setAlert;