import React from 'react'
import Context from '../Context'
import logic from '../../logic'
import Card from '../Card'

function Player({ player, hand }) {
    return <>
        {hand.turnPos === player.position ?
            <li style={{ color: "red" }} key={Math.random() * 100}><h3>Player {player.position} </h3></li>
            : <li key={Math.random() * 100}><h3>Player {player.position} </h3></li>}
        <li key={Math.random() * 100}>Current Stack: {player.currentStack}</li>
        <li key={Math.random() * 100}>Is in hand?: {player.inHand}</li>
        <li key={Math.random() * 100}>Bet amount: {player.betAmount}</li>
        {player.cards.length &&
            <>
                {player.cards.map(card => <Card card={card} />)}
            </>
        }
    </>
}

export default Player
