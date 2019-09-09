const { validate } = require('bro-holdem-utils')
const { models: { Game } } = require('bro-holdem-data')

/**
* 
* @param {*} gameId
* @returns {Promise}
*
*/

module.exports = function (gameId) {

    validate.objectId(gameId, 'Game ID')

    return (async () => {

        // Find game
        const game = await Game.findById(gameId)
        if (!game) throw Error('Game does not exist.')

        if (game.players.length === 1) throw Error('The game is over.')
        const currentHand = game.hands[game.hands.length - 1]
        if (!currentHand) throw Error('There are no hands dealt yet.')

        if (currentHand.turnPos === currentHand.endPos) {
            //return endRound(game)
        }

        let counter, nextTurn
        do {
            (currentHand.turnPos === game.players.length - 1) ? counter = 0 : counter = currentHand.turnPos + 1
            if (game.players[counter].inHand) nextTurn = counter
        } while (nextTurn != 0 && !nextTurn)

        currentHand.turnPos = counter
        await game.save()

    })()
}

