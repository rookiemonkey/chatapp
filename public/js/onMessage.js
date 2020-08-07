// html templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTempate = document.querySelector('#location-template').innerHTML
const alertTemplate = document.querySelector('#alert-template').innerHTML

// on MESSAGE: listener for messages from server
socket.on('message', eventData => {
    let html;

    switch (eventData.type) {
        case 'new_message':
            html = Mustache.render(messageTemplate, {
                message: eventData.message,
                timestamp: moment(eventData.timestamp).format('h:mm a')
            })
            break;
        case 'new_location':
            html = Mustache.render(locationTempate, {
                location: eventData.location,
                timestamp: moment(eventData.timestamp).format('h:mm a')
            })
            break;
        case 'new_alert':
            html = Mustache.render(alertTemplate, {
                alert: eventData.alert,
                timestamp: moment(eventData.timestamp).format('h:mm a')
            })
            break;
        default:
            html = null
    }

    messages.insertAdjacentHTML('beforeend', html)
})