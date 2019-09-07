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
        const game = Game.findOne({ _id: gameId }, { _id: 0, password: 0 }).lean()
        if (!game) throw Error('Game does not exist.')
        game.id = gameId

        return game

    })()
}
