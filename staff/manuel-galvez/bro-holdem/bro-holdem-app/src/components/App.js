import React, { useState, useEffect } from 'react'
import { withRouter, Route } from 'react-router-dom'
import logic from '../logic'
import Context from './Context'
import Landing from './Landing'
import Home from './Home'
import Register from './Register'
import RegisterSuccess from './Register-Success'
import Login from './Login'
import HostGame from './Host-Game'
import JoinGame from './Join-Game'
import WelcomeTable from './Welcome-Table'


function App({ history }) {

	// States
	const [view, setView] = useState('landing')
	const [credentials, setCredentials] = useState(null)
	const [user, setUser] = useState(null)
	const [submitRegister, setSubmitRegister] = useState(null)
	const [gameId, setGameId] = useState(null)
	const [game, setGame] = useState(null)


	// Retrieve User
	useEffect(() => {
		if (credentials) {
			async function asyncRetrieveUser() {
				try {
					const { user: userRetrieved } = await logic.retrieveUser()
					await setUser(userRetrieved)
				} catch (error) {
					console.log(error.message)
				}
			}
			asyncRetrieveUser()
		}
	}, [credentials])

	// Retrieve Game
	useEffect(() => {
		if (gameId) {
			async function asyncRetrieveGame() {
				try {
					const { game: gameRetrieved } = await logic.retrieveGame(gameId)
					await setGame(gameRetrieved)
					history.push('/welcome-table')
				} catch (error) {
					console.log(error.message)
				}
			}
			setInterval(() => asyncRetrieveGame(), 1000)
		}
	}, [gameId])


	return (
		<Context.Provider value={{
			view, setView, submitRegister, setSubmitRegister, user, setUser,
			gameId, setGameId, credentials, setCredentials, game, setGame
		}} >
			<Route exact path='/' render={() => logic.userCredentials ? history.push('/home') : <Landing />} />
			<Route path='/home' render={() => logic.userCredentials ? <Home /> : history.push('/')} />
			<Route path='/register' render={() => logic.userCredentials ? history.push('/home') : <Register />} />
			<Route path='/register-success' render={() => submitRegister ? <RegisterSuccess /> : history.push('/register')} />
			<Route path='/login' render={() => logic.userCredentials ? history.push('/home') : <Login />} />
			<Route path='/host-game' render={() => logic.userCredentials ? <HostGame /> : history.push('/home')} />
			<Route path='/join-game' render={() => logic.userCredentials ? <JoinGame /> : history.push('/home')} />
			<Route path='/welcome-table' render={() => game ? <WelcomeTable /> : history.push('/home')} />
		</Context.Provider>
	)
}

export default withRouter(App)