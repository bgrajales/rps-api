require('dotenv').config()

const mongoose = require('mongoose')
const mongooseToJson = require('@meanie/mongoose-to-json')
const express = require('express')
const cors =  require('cors')
const getDbConnectionString = require('./utils/get-db-connection-string')

mongoose.plugin(mongooseToJson)

const app = express()

app.use(cors())
app.use(express.json())

// socket.io

const PORT = process.env.PORT || 4001

const http = require('http')
const socket = require('socket.io')

const server = http.createServer(app)

const io = socket(server, {
    cors: {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204
    }
})

const changeStatus = require('./middlewares/status')

io.on('connection', (socket) => {
    console.log('made socket connection', socket.id)
    let userId
    
    socket.on('login', (data) =>{
        console.log('logins', data)

        changeStatus(data.toString(), 'online')
        socket.join(data.toString())

        userId = data.toString()

        console.log(socket.rooms)
    })

    socket.on('sendChallenge', (data) => {
        console.log('sendChallenge', data)

        io.to(data.challenged.toString()).emit('challenge', data)
    })

    socket.on('joinGame', (data) => {
        console.log('joinGame', data)

        socket.join(data.gameId.toString())

        console.log(socket.rooms)
    })

    socket.on('handPicked', (data) => {
        console.log('handPicked', data)

        socket.to(data.gameId.toString()).emit('handPickedPlayer2', data.handPicked)
    })

    socket.on('logout', (data) => {
        console.log('logout')
        changeStatus(data.toString(), 'offline')
        socket.leave(socket.id)
    })

    socket.on('disconnect', () =>{
        console.log('disconnect', userId)

        if (userId) {
            changeStatus(userId, 'offline')
        }
    })

})

// Users

const login = require('./controllers/user/login')
const logout = require('./controllers/user/logout')
const register = require('./controllers/user/register')
const alreadyLoggedIn = require('./controllers/user/userAlreadyLoggedIn')
const getChallengers = require('./controllers/user/getChallengers')
const getStats = require('./controllers/user/getStats')
const getGamesHistory = require('./controllers/user/getGameHistroy')
const markNotificationAsRead = require('./controllers/user/markNotificationsAsRead')
const deleteSelectedNotif = require('./controllers/user/deleteSelectedNotif')
const searchUser = require('./controllers/user/searchUser')

// Games

const challengeUser = require('./controllers/games/challengeUser')
const getActiveGames = require('./controllers/games/getActiveGames')
const getActiveGameById = require('./controllers/games/getActiveGameById')
const setActiveGamePlayerHand = require('./controllers/games/setActiveGamePlayerHand')
const nextRound = require('./controllers/games/nextRound')
const finishGame = require('./controllers/games/finishGame')

// Users endpoints

app.post('/login', login)
app.post('/register', register)
app.post('/alreadyLoggedIn', alreadyLoggedIn)
app.post('/logout', logout)
app.post('/markNotificationAsRead', markNotificationAsRead)
app.post('/deleteSelectedNotif', deleteSelectedNotif)
app.post('/searchUsers', searchUsers)
app.get('/getChallengers', getChallengers)
app.get('/getStats', getStats)

// Games endpoints

app.post('/challengeUser', challengeUser)
app.post('/setActiveGamePlayerHand', setActiveGamePlayerHand)
app.post('/nextRound', nextRound)
app.post('/finishGame', finishGame)
app.get('/getActiveGames', getActiveGames)
app.get('/getActiveGameById', getActiveGameById)
app.get('/getGamesHistory', getGamesHistory)

mongoose.connect(getDbConnectionString(), { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        server.listen(PORT, () => {
            console.log(`listening on port ${PORT}`)
        })
    }).catch(error => {
        console.error('No fue posible conectarse a la base de datos', error)
    })


