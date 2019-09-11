import authenticateUser from './authenticate-user'
import registerUser from './register-user'
import retrieveUser from './retrieve-user'
import isUserLoggedIn from './is-user-logged-in'
import logUserOut from './log-user-out'
import hostGame from './host-game'
import joinGame from './join-game'
import retrieveGame from './retrieve-game'


export default {
    set __token__(token) {
        sessionStorage.token = token
    },
    get __token__() {
        return sessionStorage.token
    },

    isUserLoggedIn,
    logUserOut,
    registerUser,
    authenticateUser,
    retrieveUser,
    hostGame,
    joinGame,
    retrieveGame

}