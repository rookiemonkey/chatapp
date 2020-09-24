socket.on('rooms', (rooms) => {
    const roomTemplate = document.querySelector('#room-template').innerHTML
    const roomOptions = document.querySelector('#rooms');

    if (rooms.length === 0) {
        roomOptions.setAttribute('disabled', 'disabled')
        const html = Mustache.render(roomTemplate, { room: 'No avaiable rooms' })
        roomOptions.insertAdjacentHTML('beforeend', html)
    }

    rooms.forEach(room => {
        const html = Mustache.render(roomTemplate, { room })
        roomOptions.insertAdjacentHTML('beforeend', html)
    })
})