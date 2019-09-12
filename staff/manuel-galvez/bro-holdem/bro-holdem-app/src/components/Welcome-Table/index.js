import React, { useContext } from 'react'
import Context from '../Context'
import logic from '../../logic'


function WelcomeTable() {

    const { game, user, setGameId } = useContext(Context)

    async function handleStartGame() {

        try {
            await logic.dealHand(logic.__gameId__)
        } catch (error) {
            console.log(error)
        }
    }

    return <>
        {game ?
            <section>

                <h3>
                    <span>Welcome the table {game.name}, {user.username} </span>
                    {(game.host === user.id && game.status !== 'playing') && <button onClick={handleStartGame}>Start game</button>}
                    <ul>
                        <h3>Table specs</h3>
                        <li>Game name {game.name}</li>
                        <li>Current Big Blind: {game.currentBB}</li>
                        <li>Current Small Blind: {game.currentSB}</li>
                        <li>Game status: {game.status}</li>
                        {game.status === 'playing' &&
                            <>
                                <li>Card 1: {game.hands[0].tableCards[0].ref}</li>
                                <li>Card 2: {game.hands[0].tableCards[1].ref}</li>
                                <li>Card 3: {game.hands[0].tableCards[2].ref}</li>
                            </>
                        }
                        {game.players.map(player =>
                            <>
                                <li><h3>Player {player.position} </h3></li>
                                {game.status === 'playing' &&
                                    <>
                                        <li>Cards: {player.cards[0].ref}</li>
                                        <li>Cards: {player.cards[1].ref}</li>
                                    </>
                                }
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
