const jwt = require('jsonwebtoken')
const otplib = require('otplib')
const { userModel } = require('../../models/user')

module.exports = (request, response) => {
    const refreshTokenBody = request.body.refreshToken

    if (refreshTokenBody) {
        // Token de usuario
        jwt.verify(refreshTokenBody, process.env.JWT_KEY, (error, decoded) => {

            if (error) {
                response.status(401).json({
                    message: 'Invalid token'
                })
            } else {
                // Si el token es correcto, seguimos con el proceso
                if (decoded.type === 'REFRESH') {
                    
                    const token = jwt.sign({
                        id: decoded.id,
                        userName: decoded.userName,
                        type: 'TOKEN'
                    }, process.env.JWT_KEY, { expiresIn: '15m' })

                    const refreshToken = jwt.sign({
                        id: decoded.id,
                        userName: decoded.userName,
                        type: 'REFRESH'
                    }, process.env.JWT_KEY, { expiresIn: '30d' })
        
                    userModel.findOne({
                        userName: decoded.userName
                    }).then(user => {
                        if (user) {

                            const responseUser = user.toJSON()

                            delete responseUser.password

                            response.status(200).json({
                                user: responseUser,
                                token,
                                refreshToken
                            })

                        } else {
                            response.status(401).json({
                                message: 'Invalid token'
                            })
                        }
                    }).catch(error => {
                        response.status(500).end()
                    })
                    
                } else {
                    response.status(401).json({
                        message: 'Invalid token'
                    })
                }
            }


        })
        
    } else {
        response.status(401).end()
    }
}