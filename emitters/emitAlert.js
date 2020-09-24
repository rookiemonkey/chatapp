const emitAlert = message => {
    return {
        type: 'new_alert',
        alert: message,
        timestamp: new Date().getTime()
    }
}

module.exports = emitAlert;