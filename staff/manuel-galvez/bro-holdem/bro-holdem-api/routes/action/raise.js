const logic = require('../../logic')

module.exports = async function (req, res) {

    const { body: { raiseAmount }, params: { gameId }, userId } = req

    try {
        await logic.raise(gameId, userId, raiseAmount)
        // const { userName, gameName } = await logic.call(gameId, userId)
        res.status(200).json({ message: `Successful raise` })
        //res.status(200).json({ message: `${userName} checked and keeps playing hand in ${ gameName }.` })
    } catch ({ message }) {
        res.status(400).json({ error: message })
    }
}






























