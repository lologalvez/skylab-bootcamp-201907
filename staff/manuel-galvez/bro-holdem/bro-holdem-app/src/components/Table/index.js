import React, { useContext } from 'react'
import { withRouter } from 'react-router-dom'
import Context from '../Context'
import logic from '../../logic'
import Player from '../Player'
import Card from '../Card'
import ActionButtons from '../Action-Buttons'


function Table({ history }) {

    const { game, user, setGameId } = useContext(Context)

    async function handleStartGame() {
        if (logic.isUserInGame()) {
            try {
                await logic.dealHand(logic.__gameId__)
            } catch (error) {
                console.log(error)
            }
        }
    }

    async function handleLeaveGame() {
        if (logic.isUserInGame()) {
            try {
                await logic.leaveGame(logic.__gameId__)
                history.push('/home')
            } catch (error) {
                console.log(error)
            }
        }
    }

    return <>
        {game && user && logic.isUserInGame() ?
        <>
        <section class="poker__container">
            <div class="poker-header">
                <span>Welcome the table {game.name}, {user.username} </span>
                {(game.host === user.id && game.status !== 'playing') && <button className="poker-header__button" onClick={handleStartGame}>Start game</button>}
                <button className="poker-header__button" onClick={handleLeaveGame}>Leave table</button>
            </div>
            <div class="poker-table">
                <img className="poker-table__image" src={"./assets/table-nobg-svg-01.svg"} alt="Poker Table" />
            </div>
            <section>
                <ul>
                    <h3>Table specs</h3>
                    <li>Game ID: {logic.__gameId__}</li>
                    <li>Game name {game.name}</li>
                    <li>Current Big Blind: {game.currentBB}</li>
                    <li>Current Small Blind: {game.currentSB}</li>
                    <li>Game status: {game.status}</li>
                    {game.status === 'playing' &&
                        <>
                        <li>HAND POT: {game.hands[game.hands.length - 1].pot}</li>
                        {game.hands[game.hands.length - 1].tableCards.map(card => game.hands[game.hands.length - 1].round !== 0 ? <Card cardImage={card.image} /> : <Card cardImage={'/images/back.png'} />)}
                        </>
                    }
                    {game.players.map(player => player && <Player player={player} hand={game.hands[game.hands.length - 1]} />)}
                </ul>
                <ActionButtons hand={game.hands[game.hands.length - 1]} />
            </section>
        </section>
        </>
        :
        setGameId(logic.__gameId__)
        }
    </>

}
export default withRouter(Table)
