import React, { useContext } from 'react'
import Context from '../Context'
import logic from '../../logic'

function TableCards() {

    const { game } = useContext(Context)

    return <>
        {game.hands[game.hands.length - 1].tableCards.map(card =>
            <li><img src={card.image}></img></li>
        )}
    </>
}

export default TableCards
