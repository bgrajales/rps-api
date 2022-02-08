const { Schema } = require('mongoose')

const activeGameSchema = new Schema({
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    gameType: {
        type: String,
        required: true,
    },
    player1: {
        id: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true
        }
    },
    player2: {
        id: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true
        }
    },
    currentRound: {
        type: Number,
        required: true,
        default: 1
    },
    rounds: {
        type: Array,
        required: true,
        default: [
            {
                round: 1,
                player1hand: 'null',
                player2hand: 'null',
                winner: 'null'
            },
            {
                round: 2,
                player1hand: 'null',
                player2hand: 'null',
                winner: 'null'
            },
            {
                round: 3,
                player1hand: 'null',
                player2hand: 'null',
                winner: 'null'
            }
        ]
    },
    chat: {
        type: Array,
        required: true,
        default: []
    }
})

module.exports = {
    activeGameSchema
}