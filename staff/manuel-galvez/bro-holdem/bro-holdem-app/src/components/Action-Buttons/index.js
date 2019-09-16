import React from 'react'
import logic from '../../logic'

function ActionButtons({ hand }) {

    async function handleCall() {
        try {
            await logic.actionCall(logic.__gameId__)
            const { stage } = await logic.updateTurn(logic.__gameId__)
            if (stage === 'Hand') await logic.dealHand(logic.__gameId__)
        } catch (error) {
            console.log(error.message)
        }
    }

    async function handleCheck() {
        try {
            await logic.actionCheck(logic.__gameId__)
            const { stage } = await logic.updateTurn(logic.__gameId__)
            if (stage === 'Hand') await logic.dealHand(logic.__gameId__)
        } catch (error) {
            console.log(error.message)
        }
    }

    function handleSubmitAmount(event) {
        event.preventDefault()
        const { target: { raiseAmount: { value: raiseAmount } } } = event
        handleRaise(raiseAmount)

    }

    async function handleRaise(raiseAmount) {
        try {
            await logic.actionRaise(logic.__gameId__, raiseAmount)
            const { stage } = await logic.updateTurn(logic.__gameId__)
            if (stage === 'Hand') await logic.dealHand(logic.__gameId__)
        } catch (error) {
            console.log(error.message)
        }
    }

    async function handleFold() {
        try {
            await logic.actionFold(logic.__gameId__)
            const { stage } = await logic.updateTurn(logic.__gameId__)
            if (stage === 'Hand') await logic.dealHand(logic.__gameId__)
        } catch (error) {
            console.log(error.message)
        }
    }

    return <>
        <button className="action-button" onClick={handleCall}>Call</button>
        <button className="action-button" onClick={handleCheck}>Check</button>
        <button className="action-button" onClick={handleFold}>Fold</button>
        <form onSubmit={handleSubmitAmount}>
            <button className="action-button"  >Raise</button>
            <input type="text" name="raiseAmount"></input>
        </form>
    </>
}

export default ActionButtons
