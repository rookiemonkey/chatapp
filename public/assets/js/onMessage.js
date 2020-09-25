// html templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const usermessageTemplate = document.querySelector('#user-message-template').innerHTML
const alertusermessageTemplate = document.querySelector('#alert-user-message-template').innerHTML
const locationTempate = document.querySelector('#location-template').innerHTML
const userlocationTempate = document.querySelector('#user-location-template').innerHTML
const alertTemplate = document.querySelector('#alert-template').innerHTML

// on MESSAGE: listener for messages from server
socket.on('message', eventData => {
    let html;

    switch (eventData.type) {


        case 'new_message':

            // for errors
            if (eventData.message === 'Profanity is not allowed') {
                html = Mustache.render(alertusermessageTemplate, {
                    message: eventData.message,
                    username: eventData.sender,
                    timestamp: moment(eventData.timestamp).format('h:mm a')
                })
            }

            // current user message
            else if (username === eventData.sender) {
                html = Mustache.render(usermessageTemplate, {
                    message: eventData.message,
                    username: eventData.sender,
                    timestamp: moment(eventData.timestamp).format('h:mm a')
                })
            }

            // other users message
            else {
                html = Mustache.render(messageTemplate, {
                    message: eventData.message,
                    username: eventData.sender,
                    timestamp: moment(eventData.timestamp).format('h:mm a')
                })
            }
            break;



        case 'new_location':
            if (username === eventData.sender) {
                html = Mustache.render(userlocationTempate, {
                    location: eventData.location,
                    username: eventData.sender,
                    timestamp: moment(eventData.timestamp).format('h:mm a')
                })
            }
            else {
                html = Mustache.render(locationTempate, {
                    location: eventData.location,
                    username: eventData.sender,
                    timestamp: moment(eventData.timestamp).format('h:mm a')
                })
            }
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