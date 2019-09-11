import React, { useContext } from 'react'
import Context from '../Context'


function WelcomeTable() {

    const { game, user, setSubmitTable } = useContext(Context)

    return <>
        <section>
            <h3>
                <span>Welcome the table {game.name}, {user.username} </span>
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
    </>
}

export default WelcomeTable
