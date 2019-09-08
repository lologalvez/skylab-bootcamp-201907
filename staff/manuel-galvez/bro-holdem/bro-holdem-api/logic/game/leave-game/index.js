const { validate } = require('bro-holdem-utils')
const { models: { User, Game } } = require('bro-holdem-data')

/**
* 
* @param {*} gameId
* @param {*} userId
* 
* @returns {Promise}
*/

module.exports = function (gameId, userId) {

    validate.objectId(gameId, 'Game ID')
    validate.objectId(userId, 'User ID')

    return (async () => {

        // Find game
        const game = await Game.findById(gameId)
        if (!game) throw Error('Game does not exist.')

        const leavingPlayerIndex = game.players.findIndex(player => String(player.user) === userId)
        if (leavingPlayerIndex === -1) throw Error(`User with id ${userId} is not a player of game with id ${game}.`)

        const user = await User.findById(userId)
        if (!user) throw Error(`User does not exist.`)

        // Remove player from game
        game.players.splice(leavingPlayerIndex, 1)

        await game.save()

        return { userName: user.username, gameName: game.name }

    })()
}
