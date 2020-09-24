const userTemplate = document.querySelector('#user-template').innerHTML
const sidebar = document.querySelector('#sidebar')

socket.on('onRoom', eventData => {
    const { users, room } = eventData
    const exisitingElement = document.querySelector('#user-template-container')

    if (exisitingElement) { sidebar.removeChild(exisitingElement) }

    const html = Mustache.render(userTemplate, { users, room })

    sidebar.insertAdjacentHTML('beforeend', html)
})