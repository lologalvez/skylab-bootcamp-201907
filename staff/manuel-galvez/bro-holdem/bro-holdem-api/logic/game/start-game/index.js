const mongoose = require('mongoose')
const validate = require('../../../utils/validate')
const cardDealing = require('../../../utils/card-dealing')
const { Game, Player, Card, Hand } = require('../../../models')

/**
* 
* @param {*} gameId
* 
* @returns {Promise}
*/

module.exports = function (gameId) {

    validate.objectId(gameId, 'Game ID')

    return (async () => {

        // Find game
        const game = await Game.findById(gameId)
        if (!game) throw Error('Game does not exist.')

        // Check if there are enough participants to start a game
        if (game.players.length < 2) throw Error('Not enough players to start a game.')

        // Change game status
        game.status = 'playing'

        // Deal first hand
        const newHand = new Hand({
            pot: 0,
            dealerPos: 0,
            bbPos: game.players.length - 1,
            sbPos: game.players.length - 2,
            turnPos: 1,
            round: 0
        })

        // Deal flop cards
        await cardDealing(newHand.tableCards, 3, newHand.usedCards)

        // Players setup and dealing
        for (const player of game.players) {

            // Card Dealing
            await cardDealing(player.cards, 2, newHand.usedCards)

            // Status
            player.inHand = true

            // Blinds assignment
            let isBlind, blindAmount, stackLeft
            if (player.position === newHand.bbPos) { isBlind = true; blindAmount = game.currentBB }
            if (player.position === newHand.sbPos) { isBlind = true; blindAmount = game.currentSB }
            if (isBlind) {
                stackLeft = player.currentStack - blindAmount
                if (stackLeft < 0) {
                    player.betAmount = player.currentStack
                    player.currentStack = 0
                } else if (stackLeft > 0) {
                    player.betAmount = blindAmount
                    player.currentStack = stackLeft
                }
                isBlind = false
            }
        }

        game.hands.push(newHand)
        await game.save()
        return game.name
    })()
}
