// io is was available becuase of src='/socket.io/socket.io.js'
// once io() is invoked, it triggers connection to the socket enabled server
// isNowConnected should be matched on the socket.emit on the server
const socket = io()

socket.on('message', eventData => {
    console.log(eventData)
})

const input = document.querySelector('#input')
const send = document.querySelector('#submit')
const loc = document.querySelector('#location')
send.addEventListener('click', sendMessage)
loc.addEventListener('click', locationMessage)
window.addEventListener("unload", disconnectMessage);

function sendMessage() {
    socket.emit('newMessage', input.value, ackMessageFromServer => {
        console.log('Message was delivered', ackMessageFromServer)
    })
}

function disconnectMessage() {
    socket.emit('disconnect')
}

function locationMessage() {
    if (!navigator.geolocation) { alert('Geolocation not supported by browser') }

    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords
        const loc = `https://www.google.com/maps?q=${latitude},${longitude}`
        socket.emit('location', loc)
    })
}
