// send new message
const form = document.querySelector('#form')
const input = form.querySelector('#input')
const send = form.querySelector('#submit')
const messages = document.querySelector('#messages')
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