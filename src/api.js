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
const updateChat = require('./controllers/games/updateChat')

io.on('connection', (socket) => {
    let userId
    
    socket.on('login', (data) =>{

        changeStatus(data.toString(), 'online')
        socket.join(data.toString())

        userId = data.toString()

    })

    socket.on('sendChallenge', (data) => {

        io.to(data.challenged.toString()).emit('challenge', data)
    })

    socket.on('joinGame', (data) => {

        socket.join(data.gameId.toString())

    })

    socket.on('handPicked', (data) => {

        socket.to(data.gameId.toString()).emit('handPickedPlayer2', {
            handPicked: data.handPicked,
            round: data.round
        })
    })

    socket.on('messageSent', (data) => {

        socket.to(data.gameId.toString()).emit('recieveMessage', {
            sender: 'player2',
            message: data.message,
            date: new Date(),
        })

        updateChat(data.gameId, data.userId, data.challengedId, data.message)
    })

    socket.on('logout', (data) => {
        changeStatus(data.toString(), 'offline')
        socket.leave(socket.id)
    })

    socket.on('disconnect', () =>{

        if (userId) {
            changeStatus(userId, 'offline')
        }
    })

})

const checkUserCredentials = require('./middlewares/checkUserCredentials')
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
const refreshToken = require('./controllers/user/refreshToken')

// Games

const challengeUser = require('./controllers/games/challengeUser')
const getActiveGames = require('./controllers/games/getActiveGames')
const getActiveGameById = require('./controllers/games/getActiveGameById')
const setActiveGamePlayerHand = require('./controllers/games/setActiveGamePlayerHand')
const nextRound = require('./controllers/games/nextRound')
const finishGame = require('./controllers/games/finishGame')
const challengeAi = require('./controllers/games/challengeAi')
const setAiGamePlayerHand = require('./controllers/games/setAiGamePlayerHand')

// Users endpoints

app.post('/login', login)
app.post('/register', register)
app.post('/logout', logout)
app.post('/alreadyLoggedIn', alreadyLoggedIn)
app.post('/refreshToken', refreshToken)
app.post('/markNotificationAsRead', checkUserCredentials(), markNotificationAsRead)
app.post('/deleteSelectedNotif', checkUserCredentials(), deleteSelectedNotif)
app.get('/searchUser', checkUserCredentials(), searchUser)
app.get('/getChallengers', checkUserCredentials(), getChallengers)
app.get('/getStats', checkUserCredentials(), getStats)

// Games endpoints

app.post('/challengeUser', checkUserCredentials(), challengeUser)
app.post('/challengeAi', checkUserCredentials(), challengeAi)
app.post('/setActiveGamePlayerHand', checkUserCredentials(), setActiveGamePlayerHand)
app.post('/setAiGamePlayerHand', checkUserCredentials(), setAiGamePlayerHand)
app.post('/finishGame', checkUserCredentials(), finishGame)
app.get('/nextRound', checkUserCredentials(), nextRound)
app.get('/getActiveGames', checkUserCredentials(), getActiveGames)
app.get('/getActiveGameById', checkUserCredentials(), getActiveGameById)
app.get('/getGamesHistory', checkUserCredentials(), getGamesHistory)

mongoose.connect(getDbConnectionString(), { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        server.listen(PORT, () => {
            (`listening on port ${PORT}`)
        })
    }).catch(error => {
        console.error('No fue posible conectarse a la base de datos', error)
    })


