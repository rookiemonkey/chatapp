socket.on('rooms', (rooms) => {
    const roomTemplate = document.querySelector('#room-template').innerHTML
    const roomOptions = document.querySelector('#rooms');

    if (rooms.length === 0) {
        roomOptions.insertAdjacentHTML('afterend', '<small class="room_noavilable">No Available Chat Rooms</small>')
    }

    rooms.forEach(room => {
        const html = Mustache.render(roomTemplate, { room })
        roomOptions.insertAdjacentHTML('beforeend', html)
    })
})