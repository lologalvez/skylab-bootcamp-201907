const mongoose = require('mongoose')
const validate = require('../../../utils/validate')
const gameCheck = require('../../../utils/game-check')
const { Game, Action } = require('../../../models')

/**
* 
* @param {*} gameId 
* @param {*} playerId 
* @param {*} actionType 
* @param {*} actionAmount 
* 
* @returns {Promise}
*/

module.exports = function (gameId, userId) {

    validate.objectId(gameId, 'Game ID')
    validate.objectId(userId, 'User ID')

    return (async () => {
        /* Folding is throwing cards, sit out from current hand */

        // Basic game checks
        const { player, game, currentHand } = await gameCheck(gameId, userId)

        // Update player
        player.inHand = false
        player.cards = []

        // Register action
        const action = new Action({
            type: 'fold',
            playerStack: player.currentStack,
            playerPos: player.position,
            playerCards: player.cards,
            betAmount: player.betAmount,
            handPot: currentHand.pot
        })
        action.user = player.user
        action.player = player.id
        action.game = game.id
        action.hand = currentHand.id

        await Promise.all([action.save(), game.save()])

        // End of round check (utils)
        const lastBet = player.betAmount
        if (player.position === currentHand.endPos) {
            const endOfRound = game.players.every(player => player.inHand && player.betAmount === lastBet)
            if (endOfRound) {
                console.log('End of round')
                /* 
                - Update hand.round
                - Set all players betAmount to 0
                - Deal new card to hand.tableCards (and usedCards)
                - Reset turnPos to first after dealer that is in_hand 
                - Check if hand is over
                - Check if blinds must be be increased (optional)
                */
            }
        }

        // If not round end, move turn position

    })()
}
