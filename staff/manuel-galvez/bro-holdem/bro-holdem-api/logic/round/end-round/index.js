const { validate, cardDealing } = require('bro-holdem-utils')
const { models: { Game } } = require('bro-holdem-data')

/**
* 
* @param {*} gameId
* @returns {Promise}
*
*/

module.exports = function (gameId) {
    /* End betting round implies:
        - Reset turnPos (only if not folded) (hand)
        - reset bet amount of each player (player)
        - Update round (game)
        - Deal new card (check if not river already, else call end-game)
    */

    validate.objectId(gameId, 'Game ID')

    return (async () => {

        // Find game
        const game = await Game.findById(gameId)
        if (!game) throw Error('Game does not exist.')

        // Check if enough players
        if (game.players.length === 1) throw Error('Only one player in hand.')
        const currentHand = game.hands[game.hands.length - 1]
        if (!currentHand) throw Error('There are no hands dealt yet.')

        // Check if all players inHand have the highest bet on table
        const highestBet = Math.max.apply(Math, game.players.map(key => key.betAmount))

        const betCheck = game.players.every(player => {
            if (player.inHand)
                return player.betAmount === highestBet
            return true
        })
        if (!betCheck) throw Error('There are players that have not called the highest bet')

        // Update turn position starting from dealer + 1 (first inHand)
        currentHand.turnPos = game.players.map((player, idx) => idx !== 0 && player.inHand).indexOf(true)

        // Update end position counting counter-clockwise 
        currentHand.endPos = game.players.map((player, idx) => idx !== currentHand.turnPos && player.inHand).lastIndexOf(true)

        // Reset bet amount of each player to zero
        game.players.forEach(player => player.betAmount = 0)

        // Update round
        currentHand.round += 1

        // Deal new card only if current round is 2 or 3
        if ([2, 3].includes(currentHand.round)) {
            await cardDealing(currentHand.tableCards, 1, currentHand.usedCards)
        }

        await game.save()
    })()
}

