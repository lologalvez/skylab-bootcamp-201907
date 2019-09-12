import React from 'react'
import logic from '../../logic'

function PlayerCard({ card }) {

    return <>
        <li><img src={`http://localhost:8080${card.image}`} width="75" height="100" /></li>
    </>
}

export default PlayerCard
