import React from 'react'
import logic from '../../logic'
import Card from '../Card'

function Player({ player, hand }) {
    return <>
        {player &&
            <>
            <section className="player">
                <div class="player-details">
                    <div className={`player-avatar player-avatar--${(hand && hand.turnPos === player.position) ? 'active' : 'inactive' }`}>
                        <img className="player-avatar__img" src="http://localhost:8080/images/ramon.jpg" width="60" height="50" />
                    </div>
                    <div className="player-info">
                        <div className="player-info__username">{player.user.username}</div>
                        <div className="player-info__stack">{player.currentStack}</div>
                    </div>
                </div>
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
