import React from 'react'

function Card({ cardImage }) {

    return <>
        {cardImage &&
        <img alt="" src={`http://localhost:8080${cardImage}`} width="75" height="100" />
        }
    </>
}

export default Card
