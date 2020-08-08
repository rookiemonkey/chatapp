// send location message
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

            if (ackMessageFromServer.error) { return alert(ackMessageFromServer.error) }

            toScroll()
        })
    })
}