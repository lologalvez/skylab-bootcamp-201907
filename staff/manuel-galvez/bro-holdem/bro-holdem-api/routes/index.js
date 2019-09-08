const { Router } = require('express')
const tokenMiddleware = require('../helpers/token-middleware')
const bodyParser = require('body-parser')

const { registerUser, authenticateUser } = require('./user')
const { hostGame, joinGame, startGame, retrieveGame, leaveGame } = require('./game')
const { call, check, fold, raise } = require('./action')

const router = Router()
const jsonBodyParser = bodyParser.json()


/* USER */
router.post('/users', jsonBodyParser, registerUser)
router.post('/auth', jsonBodyParser, authenticateUser)

/* GAME */
router.post('/games', [tokenMiddleware, jsonBodyParser], hostGame)
router.post('/games/:gameId', [tokenMiddleware, jsonBodyParser], startGame)
router.get('/games/:gameId', [tokenMiddleware, jsonBodyParser], retrieveGame)
router.post('/games/:gameId/player', [tokenMiddleware, jsonBodyParser], joinGame)
router.delete('/games/:gameId/player', [tokenMiddleware, jsonBodyParser], leaveGame)
//router.post('/games/:gameId/turn', [tokenMiddleware, jsonBodyParser], changeTurn)
//router.post('/games/:gameId/hand', [tokenMiddleware, jsonBodyParser], newHand)

/* ACTION */
router.post('/games/:gameId/action/call', [tokenMiddleware, jsonBodyParser], call)
router.post('/games/:gameId/action/check', [tokenMiddleware, jsonBodyParser], check)
router.post('/games/:gameId/action/fold', [tokenMiddleware, jsonBodyParser], fold)
router.post('/games/:gameId/action/raise', [tokenMiddleware, jsonBodyParser], raise)

module.exports = router