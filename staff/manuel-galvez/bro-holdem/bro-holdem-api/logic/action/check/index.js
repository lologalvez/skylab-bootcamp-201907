const { validate } = require('bro-holdem-utils')
const { gameCheck } = require('bro-holdem-utils')
const { models: { Action } } = require('bro-holdem-data')
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
        /* Check is like passing turn, no extra bets placed (0 bets or BB acceptance) */

        // Basic game checks
        const { player, game, currentHand } = await gameCheck(gameId, userId)

        // Find highest bet in hand
        const highestBet = Math.max.apply(Math, game.players.map(key => key.betAmount))

        if (highestBet > player.betAmount) throw Error('Check is not possible: there is a higher bet placed on the table.')

        // Register action
        const action = new Action({
            type: 'check',
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

        await action.save()

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
