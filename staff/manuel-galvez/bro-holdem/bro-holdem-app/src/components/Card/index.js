import React from 'react'
const REACT_APP_API_PUBLIC = process.env.REACT_APP_API_PUBLIC

function Card({ cardImage }) {

    return <>
        {cardImage &&
        <img className="poker-card" alt="" src={`${REACT_APP_API_PUBLIC}${cardImage}`} />
        }
    </>
}

export default Card
