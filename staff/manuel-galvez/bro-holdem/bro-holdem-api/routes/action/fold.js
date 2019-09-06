const logic = require('../../logic')

module.exports = async function (req, res) {

    const { params: { gameId }, userId } = req

    try {
        await logic.fold(gameId, userId)
        // const { userName, gameName } = await logic.call(gameId, userId)
        res.status(200).json({ message: `Successful fold` })
        //res.status(200).json({ message: `${userName} folded cards.` })
    } catch ({ message }) {
        res.status(400).json({ error: message })
    }
}






























