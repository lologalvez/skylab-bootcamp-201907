import React from 'react'
import logic from '../../logic'
import Card from '../Card'

function Player({ player, hand }) {
    return <>
        {player &&
            <>
            <section className="player" style={{ border: `1px solid ${hand && hand.tunPos === player.position ? 'red': 'black'}` }}>
                <div className="player__avatar">
                    <img className="player__img" src="http://localhost:8080/images/ramon.jpg" width="60" height="50"/>
                </div>
                <div className="player__info">
                    <div className="player__username">{player.user.username}</div>
                    <div className="player__stack">{player.currentStack}</div>
                </div>
                <div className="player__bet">{player.betAmount}</div>
            {player.cards.length &&
                <>
                {player.cards.map(card =>
                    logic.retrieveUserId() === player.user.id ? <Card cardImage={card.image} /> : <Card cardImage={'/images/back.png'} />
                )}
                </>
            }
            </section>
            </>
        }
    </>
}

export default Player
