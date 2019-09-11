import React, { useContext, useEffect } from 'react'
import logic from '../../logic'
import Context from '../Context'
import { Link, withRouter } from 'react-router-dom'


function JoinGame({ history }) {

    const { setGameId } = useContext(Context)

    function handleSubmit(event) {
        event.preventDefault()
        const { target: {
            accessKey: { value: accessKey },
        } } = event

        handleJoinGame(accessKey)
    }

    async function handleJoinGame(accessKey) {
        try {
            await logic.joinGame(accessKey)
            setGameId(accessKey)
        } catch (error) {
            console.log(error.message)
        }
    }

    return <>
        <form onSubmit={handleSubmit}>
            <input type="text" name="accessKey" />
            <button>Submit</button>
        </form>
        <Link to="/">Go back</Link>
    </>


}

export default withRouter(JoinGame)