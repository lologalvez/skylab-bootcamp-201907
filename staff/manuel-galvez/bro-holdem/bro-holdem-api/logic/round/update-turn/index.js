const { Game } = require('../../../models')
const validate = require('../../../utils/validate')

/**
* 
* @param {*} gameId
* @returns {Promise}
*
*/

module.exports = function (gameId) {

    validate.objectId(gameId, 'Game ID')

    return (async () => {

        const game = await Game.findById(gameId)
        if (!game) throw Error('Game does not exist.')

        if (game.players.length === 1) throw Error('The game is over.')
        const currentHand = game.hands[game.hands.length - 1]
        if (!currentHand) throw Error('There are no hands dealt yet.')

        if (hand.turnPos === hand.endPos) {
            //return checkRound(game)
        }

        let counter, nextTurn
        do {
            hand.turnPos === game.players.length ? counter = 0 : counter = hand.position + 1
            if (game.players[counter].inHand) nextTurn = counter
        } while (!nextTurn)

        hand.turnPos = counter
        await game.save()

    })()
}

