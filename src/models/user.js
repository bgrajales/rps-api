const { model, Schema } = require('mongoose')
const { activeGameSchema } = require('./activeGame')
const { gameHistorySchema } = require('./gameHistory')
const { notificationSchema } = require('./notification')

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        required: true,
        trim: true,
        default: 'offline'
    },
    activeGames: {
        type: [activeGameSchema],
        default: () => ([])
    },
    gamesHistory: {
        type: [gameHistorySchema],
        default: () => ([])
    },
    notifications: {
        type: [notificationSchema],
        default: () => ([])
    }
})

const userModel = model('users', userSchema)

module.exports = {
    userSchema,
    userModel
}