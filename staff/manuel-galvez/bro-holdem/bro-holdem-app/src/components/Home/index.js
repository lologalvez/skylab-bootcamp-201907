import React, { useContext } from 'react'
import Context from '../Context'
import { Link } from 'react-router-dom'

function Home() {

    const { user } = useContext(Context)

    return <>
        {user &&
            <h2>Hello, {user.username}</h2>}
        {!user &&
            <h2>Hello, user</h2>}
        <Link to="/host-game">Host Game</Link>
        <Link to="/join-game">Join Game</Link>
    </>
}

export default Home