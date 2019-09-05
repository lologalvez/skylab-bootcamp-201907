const mongoose = require('mongoose')
const { Schema, ObjectId } = mongoose

module.exports = new Schema({
    move: {
        type: [String],
        enum: ['call', 'bet', 'raise', 'check', 'fold', 'leave'],
        required: true
    },

    playerStack: {
        type: Number,
        required: true,
    },

    playerPos: {
        type: Number,
        required: true,
    },

    playerCards: {
        type: Array,
        required: true,
    },

    betAmount: {
        type: Number,
        required: true
    },

    player: { type: ObjectId, ref: 'Player' },
    game: { type: ObjectId, ref: 'Game' },
    hand: { type: ObjectId, ref: 'Hand' }
})
