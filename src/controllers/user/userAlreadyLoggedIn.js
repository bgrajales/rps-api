const jwt = require('jsonwebtoken')
const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const refreshToken = request.body.refreshToken

    if (refreshToken) {

            jwt.verify(refreshToken, process.env.JWT_KEY, (err, decoded) => {
                if (err) {
                    console.error('Error al verificar el token', err)
                    response.status(401).end()
                } else {
                    userModel.findById(decoded.id).then(user => {
                        if (user) {

                            const responseUser = user.toJSON()

                            delete responseUser.password

                            const token = jwt.sign({
                                id: responseUser._id,
                                userName: responseUser.userName,
                                type: 'TOKEN'
                            }, process.env.JWT_KEY, { expiresIn: '15m' })

                            response.json({
                                user: responseUser,
                                token: token,
                            })
                        } else {
                            console.error('Usuario no encontrado')
                            response.status(401).end()
                        }
                    }).catch(error => {
                        console.error('No fue posible conectarse a la base de datos', error)
                        response.status(500).end()
                    })
                }
            })

        }
}