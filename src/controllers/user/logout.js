const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    userModel.findOne({
        _id: request.body.userId
    }).then(user => {
        response.json({
            message: 'User logged out'
        });
    }).catch(error => {
        console.error('No fue posible conectarse a la base de datos', error)
        response.status(500).end()
    })
}