const logic = require('../../logic')

module.exports = async function (req, res) {

    const { params: { gameId }, userId } = req

    try {
        const { userName, gameName } = await logic.leaveGame(gameId, userId)
        res.status(200).json({ message: `${userName} has left ${gameName} game.` })
    } catch ({ message }) {
        res.status(400).json({ error: message })
    }
}



























