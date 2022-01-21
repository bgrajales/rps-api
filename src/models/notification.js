const { Schema } = require('mongoose')

const notificationSchema = new Schema({
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'unread'
    },
    challenger: {
        type: String,
        required: true,
    },
    gameId:{
        type: String,
        required: true,
    }
})

module.exports = {
    notificationSchema
}