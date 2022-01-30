const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const { userModel } = require('../../models/user')

module.exports = (request, response) => {

    const user = request.body
    console.log(user)
    const schema = Joi.object({
        userName: Joi.string()
            .regex(/^[a-zA-Z0-9]+$/)
            .min(5)
            .max(12)
            .required(),
        password: Joi.string()
            .alphanum()
            .min(7)
            .max(50)
            .required(),
        repeatPassword: Joi.ref('password')
    })

    const validationResult = schema.validate(user)

    if (!validationResult.error) {
        userModel.findOne({
            userName: request.body.userName
        }).then(userExist => {

            if ( !userExist ) {
                user.password = bcrypt.hashSync(user.password, 2)

                userModel.create({
                    userName: user.userName,
                    password: user.password
                }).then(user => {
                    const userResponse = user.toJSON()

                    delete userResponse.password

                    // Agregamos token de usuario
                    const token = jwt.sign({
                        id: userResponse.id,
                        userName: userResponse.userName,
                        type: 'TOKEN'
                    }, process.env.JWT_KEY,{ expiresIn: '15m' })

                    const refreshToken = jwt.sign({
                        id: userResponse.id,
                        userName: userResponse.userName,
                        type: 'REFRESH'
                    }, process.env.JWT_KEY,{ expiresIn: '30d' })

                    response.status(200).json({
                        user: userResponse,
                        token: token,
                        refreshToken: refreshToken
                    })
                }).catch(error => {
                    response.status(500).json(error)
                })
            } else {
                response.status(400).json({
                    message: 'User already exists'
                })
            }
        })
    } else {
        console.log(validationResult.error)
        response.status(400).json({
            message: validationResult.error.details[0].message
        })
    }
}