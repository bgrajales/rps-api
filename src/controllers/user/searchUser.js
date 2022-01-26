const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const userName = request.query.userName

    userModel.findOne({
        userName: userName
    }).then(user => {

        if (user) {

            response.json({
                userName: user.userName,
                userId: user._id,
            })
        } else {
            response.json({
                userName: null,
                userId: null,
            })
        }
    }).catch(error => {
        console.error(error)
        response.status(500).end()
    })

}