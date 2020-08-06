// io is was available becuase of src='/socket.io/socket.io.js'
// once io() is invoked, it triggers connection to the socket enabled server
// isNowConnected should be matched on the socket.emit on the server
const socket = io()

socket.on('message', eventData => {
    console.log(eventData)
})

// send new message
const form = document.querySelector('#form')
const input = form.querySelector('#input')
const send = form.querySelector('#submit')
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
const loc = document.querySelector('#location')
loc.addEventListener('click', locationMessage)

function locationMessage() {
    if (!navigator.geolocation) { alert('Geolocation not supported by browser') }

    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords
        const loc = `https://www.google.com/maps?q=${latitude},${longitude}`
        socket.emit('location', loc, ackMessageFromServer => {
            console.log(ackMessageFromServer)
        })
    })
}
