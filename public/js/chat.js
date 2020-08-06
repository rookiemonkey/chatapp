// io is was available becuase of src='/socket.io/socket.io.js'
// once io() is invoked, it triggers connection to the socket enabled server
// isNowConnected should be matched on the socket.emit on the server
const socket = io()

socket.on('message', eventData => {
    console.log(eventData)
})

const input = document.querySelector('#input')
const btn = document.querySelector('#submit');
btn.addEventListener('click', sendMessage)
window.addEventListener("unload", disconnectMessage);

function sendMessage() {
    socket.emit('newMessage', input.value)
}

function disconnectMessage() {
    socket.emit('disconnect')
}
