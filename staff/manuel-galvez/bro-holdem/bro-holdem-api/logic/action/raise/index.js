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

module.exports = function (gameId, userId, raiseTo) {
    /* Raising is betting over the highest bet on the table */

    validate.objectId(gameId, 'Game ID')
    validate.objectId(userId, 'User ID')
    validate.number(raiseTo, 'Raise')

    return (async () => {

        // Basic game checks
        const { player, game, currentHand } = await gameCheck(gameId, userId)

        // Find highest bet in hand
        const highestBet = Math.max.apply(Math, game.players.map(key => key.betAmount))

        if (highestBet >= raiseTo) throw Error('Raise bet cannot be less than highest bet on table.')

        // Amount to be called
        const raiseAmount = raiseTo - player.betAmount

        // Update player stack
        player.currentStack -= raiseAmount
        player.betAmount = raiseTo

        // Update hand's pot and end position
        currentHand.pot += raiseAmount
        currentHand.endPos = player.position - 1 // Update last player to talk unless there's another raise */

        // Register action
        const action = new Action({
            type: 'raise',
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

        await Promise.all([game.save(), action.save()])

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
    })()
}
