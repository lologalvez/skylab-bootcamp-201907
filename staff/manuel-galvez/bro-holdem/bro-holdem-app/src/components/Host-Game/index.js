import React, { useContext, useEffect } from 'react'
import logic from '../../logic'
import Context from '../Context'
import { Link, withRouter } from 'react-router-dom'


function HostGame({ history }) {

    const { setGameId } = useContext(Context)

    function handleSubmit(event) {
        event.preventDefault()
        const { target: {
            name: { value: name },
            maxPlayers: { value: maxPlayers },
            initialStack: { value: initialStack },
            initialBB: { value: initialBB },
            initialSB: { value: initialSB },
            blindsIncrease: { value: blindsIncrease }
        } } = event

        handleHostGame(name, maxPlayers, initialStack, initialBB, initialSB, blindsIncrease)
    }

    async function handleHostGame(name, maxPlayers, initialStack, initialBB, initialSB, blindsIncrease) {
        try {
            const gameId = await logic.hostGame(name, maxPlayers, initialStack, initialBB, initialSB, blindsIncrease)
            setGameId(gameId)
        } catch (error) {
            console.log(error.message)
        }
    }

    return <>
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Game name..." />
            <input type="text" name="maxPlayers" placeholder="Max players..." />
            <input type="text" name="initialStack" placeholder="Initial stack..." />
            <input type="text" name="initialBB" placeholder="Initial Big Blind..." />
            <input type="text" name="initialSB" placeholder="Initial Small Blind..." />
            <input type="text" name="blindsIncrease" placeholder="Blinds Increase..." />
            <button>Submit</button>
        </form>
        <Link to="/">Go back</Link>
    </>


}

export default withRouter(HostGame)