const mongoose = require('mongoose')
const { expect } = require('chai')
const logic = require('../../../logic')
const { Game, User, Player } = require('../../../models')

describe('logic - start game', () => {

    before(() => {
        mongoose.connect('mongodb://localhost/bro-holdem-test', { useNewUrlParser: true })
    })


    let username, email, password, hostId
    let username2, email2, password2, joinerId
    let name, maxPlayers, initialStack, initialBB, initialSB, blindsIncrease
    let gameId

    beforeEach(() => {

        // User 1: Host
        username = `username-${Math.random()}`
        email = `email-${Math.random()}@email.com`
        password = `password-${Math.random()}`

        // User 2: Joiner
        username2 = `username-${Math.random()}`
        email2 = `email-${Math.random()}@email.com`
        password2 = `password-${Math.random()}`


        // Game
        name = `gameName-${Math.random()}`
        maxPlayers = Number((Math.random() * (6 - 4) + 4).toFixed())
        initialStack = Number(Math.random().toFixed())
        initialBB = Number((Math.random() * (50 - 25) + 25).toFixed())
        initialSB = Number((Math.random() * (50 - 25) + 25).toFixed())
        blindsIncrease = Number(Math.random().toFixed())


        return (async () => {

            // Register users
            await User.deleteMany()
            await Game.deleteMany()
            const host = new User({ username, email, password })
            hostId = host.id
            const joiner = new User({ username: username2, email: email2, password: password2 })
            joinerId = joiner.id

            // Replicate host game (create new game and add host as a player)
            const newGame = new Game({ name, maxPlayers, initialStack, initialBB, initialSB, currentBB: initialBB, currentSB: initialSB, blindsIncrease })
            gameId = newGame.id
            newGame.host = hostId

            // Create new instance of player for host
            const newPlayer = new Player({
                position: newGame.players.length,
                currentStack: initialStack,
                cards: [],
                inHand: false,
                betAmount: 0
            })
            newPlayer.user = hostId
            newGame.players.push(newPlayer)

            // Create new instance of player for joiner
            const newPlayer2 = new Player({
                position: newGame.players.length,
                currentStack: initialStack,
                cards: [],
                inHand: false,
                betAmount: 0
            })
            newPlayer2.user = joinerId
            newGame.players.push(newPlayer2)


            return Promise.all([host.save(), joiner.save(), newGame.save()])
        })()
    })

    it('should succeed on correct data', async () => {
        const result = await logic.startGame(gameId)
        expect(result).not.to.exist

        const retrievedGame = await Game.findById(gameId)
        expect(retrievedGame.status).to.equal('playing')
        expect(retrievedGame.hands.length).to.equal(1)
        expect(retrievedGame.hands[0].pot).to.equal(0)
        expect(retrievedGame.hands[0].dealerPos).to.equal(0)
        expect(retrievedGame.hands[0].bbPos).to.equal(1)
        expect(retrievedGame.hands[0].sbPos).to.equal(0)
        expect(retrievedGame.hands[0].turnPos).to.equal(1)
        expect(retrievedGame.hands[0].usedCards.length).to.equal(7)
        expect(retrievedGame.hands[0].tableCards.length).to.equal(3)
        expect(retrievedGame.players[0].inHand).to.equal(true)
        expect(retrievedGame.players[1].inHand).to.equal(true)
        expect(retrievedGame.players[0].cards.length).to.equal(2)
        expect(retrievedGame.players[1].cards.length).to.equal(2)
    })

    it('should fail if game does not exist', async () => {

        await Game.deleteMany()

        try {
            await logic.startGame(gameId)
        } catch (error) {
            expect(error).to.exist
            expect(error.message).to.equal('Game does not exist.')
        }
    })


    it('should fail on empty Game ID', () => {
        expect(() =>
            logic.startGame('')
        ).to.throw(Error, 'Game ID is empty or blank')
    })

    it('should fail on undefined Game ID', () => {
        expect(() =>
            logic.startGame(undefined)
        ).to.throw(Error, `Game ID with value undefined is not a valid ObjectId`)
    })

    it('should fail on non-valid data type for Game ID', () => {
        expect(() =>
            logic.startGame('aaaa')
        ).to.throw(Error, `Game ID with value aaaa is not a valid ObjectId`)
    })

    after(() => mongoose.disconnect())
})