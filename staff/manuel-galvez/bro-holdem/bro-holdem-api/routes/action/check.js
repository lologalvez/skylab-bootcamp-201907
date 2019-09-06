const logic = require('../../logic')

module.exports = async function (req, res) {

    const { params: { gameId }, userId } = req

    try {
        await logic.check(gameId, userId)
        // const { userName, gameName } = await logic.call(gameId, userId)
        res.status(200).json({ message: `Successful check` })
        //res.status(200).json({ message: `${userName} checked and keeps playing hand in ${ gameName }.` })
    } catch ({ message }) {
        res.status(400).json({ error: message })
    }
}






























