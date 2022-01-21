const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const limit = 6
    const skip = request.query.skip || 0
    const userId = request.query.userId

    userModel.find({
        status: 'online'
    }).limit(limit).skip(skip).then(users => {

        // users.indexOf(userId) !== -1 ? users.splice(userId, 1) : null
        const index = users.findIndex(user => user.id === userId)

        if (index !== -1) {
            users.splice(index, 1)
        }

        let onlineUsers = []

        if (users.length > 0) {
            users.forEach(user => {
                onlineUsers.push({
                    id: user.id,
                    userName: user.userName,
                })
            })
        }

        response.json({
            users: onlineUsers
        })
    }).catch(error => {
        console.error(error)
        response.status(500).end()
    })
    
}