import authenticateUser from './authenticate-user'
import registerUser from './register-user'
import retrieveUser from './retrieve-user'
import hostGame from './host-game'
import joinGame from './join-game'
import retrieveGame from './retrieve-game'


export default {
    set userCredentials(token) {
        sessionStorage.token = token
    },
    get userCredentials() {
        return sessionStorage.token
    },

    registerUser,
    authenticateUser,
    retrieveUser,
    hostGame,
    joinGame,
    retrieveGame

}