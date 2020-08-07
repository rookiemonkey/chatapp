const users = new Array()

// ADD
const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room) {
        return { error: 'username and room are required' }
    }

    const isExistingUser = users.find(user => {
        return user.room === room && user.username === username
    })

    if (isExistingUser) {
        return { error: 'username already in used in that room' }
    }

    const user = { id, username, room }
    users.push(user)
    return { user }
}


// REMOVE
const removeUser = id => {
    const isExistingUser = users.findIndex(user => user.id === id)

    if (!isExistingUser) {
        return { error: 'user is not in the room' }
    }

    return users.splice(isExistingUser, 1)[0]
}



// addUser({
//     id: 12345,
//     username: 'adafaaa',
//     room: 'aaa'
// })

// addUser({
//     id: 123145,
//     username: 'adaasfaaa',
//     room: 'aaa'
// })

// const res = addUser({
//     id: 6,
//     username: 'adaf',
//     room: 'aaa'
// })


// const removed = removeUser(123145)
// console.log('current users', users)
// console.log('removed user', removed)
