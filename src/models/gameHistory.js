const { Schema } = require('mongoose')

const gameHistorySchema = new Schema({
    endDate: { 
        type: Date,
        required: true
    },
    opponent: {
        type: String,
        required: true
    },
    win: {
        type: Number,
        required: true
    },
    picks: {
        type: Array,
        required: true
    },
})

module.exports = {
    gameHistorySchema
}