module.exports = {
    registerUser: require('./user/register-user'),
    authenticateUser: require('./user/authenticate-user'),
    hostGame: require('./game/host-game'),
    joinGame: require('./game/join-game'),
    startGame: require('./game/start-game'),
    call: require('./action/call'),
    check: require('./action/check'),
    fold: require('./action/fold'),
    raise: require('./action/raise')

}
