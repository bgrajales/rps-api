const bcrypt = require('bcrypt')
const otplib = require('otplib')
const jwt = require('jsonwebtoken')
const { userModel } = require('../../models/user')

const returnCredentials = (user, response) => {

    const responseUser = user.toJSON()

    delete responseUser.password

    const token = jwt.sign({
        id: user.id,
        userName: user.userName,
        type: 'TOKEN'
    }, process.env.JWT_KEY, { expiresIn: '15m' })

    const refreshToken = jwt.sign({
        id: user.id,
        userName: user.userName,
        type: 'REFRESH'
    }, process.env.JWT_KEY, { expiresIn: '30d' })

    response.json({
        user: responseUser,
        token: token,
        refreshToken: refreshToken
    })
    
}

module.exports = (request, response) => {
    userModel.findOne({
        userName: request.body.userName
    }).then(user => {

        if (user) {
            // Comparamos la password ingresada por el usuario con la guardada en la base de datos
            const match = bcrypt.compareSync(request.body.password, user.password)

            if (match) {
                returnCredentials(user, response)
            } else {
                response.status(401).json({
                    message: 'Usuario o contraseña incorrectos'
                })
            }
        } else {
            response.status(401).json({
                message: 'Usuario o contraseña incorrectos'
            })
        }
    }).catch(error => {
        response.status(500).end()
    })

}