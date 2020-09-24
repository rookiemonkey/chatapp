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

    if (isExistingUser < 0) {
        return { error: 'user is not in the room' }
    }

    return users.splice(isExistingUser, 1)[0]
}

// GET USER
const getUser = id => {
    const isExistingUser = users.findIndex(user => user.id === id)

    if (isExistingUser < 0) {
        return { error: 'user is not in the room' }
    }

    return users[isExistingUser]
}

// GET USERS
const getUsers = room => {
    if (!room) { return null }

    const roomQuery = room.trim().toLowerCase()

    const usersInTheRoom = users.filter(user => {
        return user.room === roomQuery
    })

    return usersInTheRoom
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsers,
    users
}