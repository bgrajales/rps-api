require('dotenv').config()

const bcrypt = require('bcrypt')
const faker = require('faker')
const mongoose = require('mongoose')
const getDbConnectionString = require('../utils/get-db-connection-string')

const { userModel } = require('../models/user')

const users = []

const userPassword = bcrypt.hashSync('superSecretPass', 10)

for (let numeroDeIteracion = 0; numeroDeIteracion < 15; numeroDeIteracion++) {
    
    users.push({
        userName: faker.internet.userName(),
        password: userPassword,
    })

}

console.log('#############################')
console.log('Seed de datos')
console.log('#############################')
console.log('Se van a insertar:')
console.log(`${users.length} Usuarios`)

mongoose.connect(getDbConnectionString(), { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        Promise.all([
            userModel.insertMany(users),
        ]).then(() => {
            // Una vez que terminan de insertarse todos los documentos, cierro la conexion a mongodb
            mongoose.connection.close()
        }).catch(error => {
            console.error('No fue posible insertar los usuarios', error)
        })
    }).catch(error => {
        console.error('No fue posible conectarse a la base de datos', error)
    })
