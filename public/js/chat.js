// io is was available becuase of src='/socket.io/socket.io.js'
// once io() is invoked, it triggers connection to the socket enabled server
// isNowConnected should be matched on the socket.emit on the server
const socket = io()

// send new message
const form = document.querySelector('#form')
const input = form.querySelector('#input')
const send = form.querySelector('#submit')
const messages = document.querySelector('#messages')
const messageTemplate = document.querySelector('#message-template').innerHTML
form.addEventListener('submit', sendMessage)

function sendMessage(event) {
    event.preventDefault()
    send.setAttribute('disabled', 'disabled')

    socket.emit('newMessage', input.value, ackMessageFromServer => {
        send.removeAttribute('disabled')

        if (ackMessageFromServer) {
            return console.log(ackMessageFromServer)
        }

        input.value = ''
        input.focus()
        console.log('Message was delivered')
    })
}


// send disconnect user message
window.addEventListener("unload", disconnectMessage);

function disconnectMessage() {
    socket.emit('disconnect')
}


// send location message
const locationTempate = document.querySelector('#location-template').innerHTML
const btn_loc = document.querySelector('#location')
btn_loc.addEventListener('click', locationMessage)

function locationMessage() {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by browser')
    }

    btn_loc.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords
        const loc = `https://www.google.com/maps?q=${latitude},${longitude}`
        socket.emit('location', loc, ackMessageFromServer => {
            btn_loc.removeAttribute('disabled')
            console.log(ackMessageFromServer)
        })
    })
}


// event listener
socket.on('message', eventData => {
    let html;

    switch (eventData.type) {
        case 'new_message':
            html = Mustache.render(messageTemplate, { message: eventData.message })
            break;
        case 'new_location':
            html = Mustache.render(locationTempate, { location: eventData.location })
            break;
        default:
            html = null
    }

    messages.insertAdjacentHTML('beforeend', html)
})

socket.on('welcome', eventData => {
    const html = Mustache.render(messageTemplate, { message: eventData })
    messages.insertAdjacentHTML('beforeend', html)
})

socket.on('joined', eventData => {
    const html = Mustache.render(messageTemplate, { message: eventData })
    messages.insertAdjacentHTML('beforeend', html)
})

socket.on('left', eventData => {
    const html = Mustache.render(messageTemplate, { message: eventData })
    messages.insertAdjacentHTML('beforeend', html)
})
