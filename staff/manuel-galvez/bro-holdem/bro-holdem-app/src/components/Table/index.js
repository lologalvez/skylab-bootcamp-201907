import React, { useContext } from 'react'
import render from 'react-dom'
import { withRouter } from 'react-router-dom'
import Context from '../Context'
import logic from '../../logic'
import Player from '../Player'
import Card from '../Card'



function Table({ history }) {

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
                                {game.hands[game.hands.length - 1].tableCards.map(card => <Card card={card} />)}
                                {game.players.map(player => <Player player={player} hand={game.hands[game.hands.length - 1]} />)}
                            </>
                        }
                    </ul>
                </h3>
            </section>
            :
            setGameId(logic.__gameId__)
        }
    </>

}
export default withRouter(Table)
