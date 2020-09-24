const userTemplate = document.querySelector('#user-template').innerHTML
const sidebar = document.querySelector('#sidebar')

const emojis = [
    '😀', '😁', '😂', '😄', '😅', '😆', '😇', '😈',
    '😉', '😊', '😋', '😌', '😍', '😎', '😏', '😐',
    '😑', '😒', '😓', '😔', '😕', '😖', '😗', '😘',
    '😙', '😚', '😛', '😜', '😝', '😞', '😟', '😠',
    '😡', '😢', '😣', '😤', '😥', '😦', '😧', '😨',
    '😩', '😪', '😫', '😬', '😭', '😮', '😯', '😰',
    '😱', '😲', '😳', '😴', '😵', '😶', '😷', '😸',
    '😹', '😺', '😻', '😼', '😽', '😾', '😿', '🙀',
    '🙁', '🙂', '🙃', '🙄'
]

socket.on('onRoom', eventData => {
    const { users, room } = eventData
    const exisitingElement = document.querySelector('#user-template-container')

    if (exisitingElement) { sidebar.removeChild(exisitingElement) }

    const randomInd = Math.floor(Math.random() * ((emojis.length - 1) - 0 + 1)) + 0;

    const html = Mustache.render(userTemplate, { users, room, emoji: emojis[randomInd] })

    sidebar.insertAdjacentHTML('beforeend', html)
})