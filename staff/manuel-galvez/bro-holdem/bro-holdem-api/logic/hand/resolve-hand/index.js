const { validate, cardDealing } = require('bro-holdem-utils')
const { models: { Game } } = require('bro-holdem-data')
const { Hand } = require('pokersolver')

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

        // Check if enough players
        if (game.players.length === 1) throw Error('Only one player in hand.')
        const currentHand = game.hands[game.hands.length - 1]
        if (!currentHand) throw Error('There are no hands dealt yet.')

        // Check if round got to final stage
        if (currentHand.round !== 3) throw Error('River stage not reached yet.')

        if (currentHand.tableCards.length !== 5) throw Error('River card was not dealt yet.')

        const playersInHand = game.players.filter(player => player.inHand)

        const handsMixed = playersInHand.map((player, idx) => {
            if (player.inHand)
                return ({ playerIndex: idx, cards: Array(...player.cards.map(card => card.ref), ...currentHand.tableCards.map(card => card.ref)) })
        })

        const solvedHands = handsMixed.map(hand => Hand.solve(hand.cards))
        const winningHands = Hand.winners(solvedHands)

        const winningHandsArrays = winningHands.map(hand => hand.cardPool.map(card => card.value + card.suit))

        let potWinners = []
        handsMixed.forEach(playerHand =>
            winningHandsArrays.forEach(handArray => {
                if (playerHand.cards.sort().toString() === handArray.sort().toString())
                    potWinners.push(playerHand.playerIndex)
            })
        )

        potWinners.forEach(index => {
            const potSlice = currentHand.pot / potWinners.length
            game.players[index].currentStack += potSlice
        })

        await game.save()

    })()
}

