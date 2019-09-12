import React, { useContext } from 'react'
import Context from '../Context'
import logic from '../../logic'


function WelcomeTable() {

    const { game, user, setGameId } = useContext(Context)

    async function handleStartGame() {

        try {
            await logic.dealHand()
        } catch (error) {
            console.log(error)
        }
    }

    return <>
        {game ?
            <section>

                <h3>
                    <span>Welcome the table {game.name}, {user.username} </span>
                    {(game.host === user.id) && <button onClick={handleStartGame}>Start game</button>}
                    <ul>
                        <h3>Table specs</h3>
                        <li>Game name {game.name}</li>
                        <li>Current Big Blind: {game.currentBB}</li>
                        <li>Current Small Blind: {game.currentSB}</li>
                        <li>Game status: {game.status}</li>
                        {game.players.map(player =>
                            <>
                                <li><h3>Player {player.position} </h3></li>
                                <li>Cards: {player.cards}</li>
                                <li>Current Stack: {player.currentStack}</li>
                                <li>Is in hand?: {player.inHand}</li>
                                <li>Bet amount: {player.betAmount}</li>
                                <br />
                            </>
                        )}
                    </ul>
                </h3>
            </section>
            :
            setGameId(logic.__gameId__)
        }

    </>
}

export default WelcomeTable
