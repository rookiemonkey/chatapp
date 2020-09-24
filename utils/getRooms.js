const Users = require('./Users').users;

const getRooms = () => {
    return [...new Set(Users.map(user => user.room))]
}

module.exports = getRooms;
