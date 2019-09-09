require('dotenv').config()
const { database } = require('bro-holdem-data')
const { expect } = require('chai')
const logic = require('../../../logic')
const { models: { Card, Game, User, Player, Hand } } = require('bro-holdem-data')

const { env: { DB_URL_TEST } } = process

describe.only('logic - end-round', () => {

    before(() => {
        database.connect(DB_URL_TEST, { useNewUrlParser: true, useUnifiedTopology: true })

    })

    let username, email, password, oneId
    let username2, email2, password2, twoId
    let username3, email3, password3, threeId
    let name, maxPlayers, initialStack, initialBB, initialSB, blindsIncrease
    let gameId

    beforeEach(() => {

        // User 1
        username = `username-${Math.random()}`
        email = `email-${Math.random()}@email.com`
        password = `password-${Math.random()}`

        // User 2
        username2 = `username-${Math.random()}`
        email2 = `email-${Math.random()}@email.com`
        password2 = `password-${Math.random()}`

        // User 3
        username3 = `username-${Math.random()}`
        email3 = `email-${Math.random()}@email.com`
        password3 = `password-${Math.random()}`

        // Game
        name = `gameName-${Math.random()}`
        maxPlayers = Number((Math.random() * (6 - 4) + 4).toFixed())
        initialStack = Number((Math.random() * (1500 - 1000) + 1000).toFixed())
        //initialBB = Number((Math.random() * (50 - 25) + 25).toFixed())
        //initialSB = Number((Math.random() * (50 - 25) + 25).toFixed())
        initialBB = 50
        initialSB = 25
        blindsIncrease = Number(Math.random().toFixed())


        return (async () => {

            // Register users
            await User.deleteMany()
            await Game.deleteMany()
            const userOne = new User({ username, email, password })
            oneId = userOne.id
            const userTwo = new User({ username: username2, email: email2, password: password2 })
            twoId = userTwo.id
            const userThree = new User({ username: username3, email: email3, password: password3 })
            three = userThree.id

            // Replicate host game (create new game and add host as a player)
            const newGame = new Game({ name, maxPlayers, initialStack, initialBB, initialSB, currentBB: initialBB, currentSB: initialSB, blindsIncrease })
            gameId = newGame.id
            newGame.host = oneId

            // Create new instance for player one
            const newPlayer = new Player({
                position: newGame.players.length,
                currentStack: initialStack,
                cards: [],
                inHand: false,
                betAmount: 0
            })
            newPlayer.user = oneId
            newGame.players.push(newPlayer)

            // Create new instance for player two
            const newPlayer2 = new Player({
                position: newGame.players.length,
                currentStack: initialStack,
                cards: [],
                inHand: false,
                betAmount: 0
            })
            newPlayer2.user = twoId
            newGame.players.push(newPlayer2)

            // Create new instance for player3
            const newPlayer3 = new Player({
                position: newGame.players.length,
                currentStack: initialStack,
                cards: [],
                inHand: false,
                betAmount: 0
            })
            newPlayer3.user = threeId
            newGame.players.push(newPlayer3)

            // Deal first hand
            const newHand = new Hand({
                pot: 0,
                dealerPos: 0,
                bbPos: newGame.players.length - 1,
                sbPos: newGame.players.length - 2,
                turnPos: 1,
                round: 0
            })

            newGame.status = 'playing'

            // Deal flop cards
            let randomNum
            let match
            for (i = 0; i < 3; i++) {
                do {
                    randomNum = Number((Math.random() * (52 - 1) + 1).toFixed())
                    match = newHand.usedCards.includes(randomNum)
                } while (match)
                newHand.tableCards.push(randomNum)
                newHand.usedCards.push(randomNum)
            }

            // Players setup and dealing
            newGame.players.forEach(player => {

                // Card dealing
                for (i = 0; i < 2; i++) {
                    do {
                        randomNum = Number((Math.random() * (52 - 1) + 1).toFixed())
                        match = newHand.usedCards.includes(randomNum)
                    } while (match)
                    player.cards.push(randomNum)
                    newHand.usedCards.push(randomNum)
                }

                // Status
                player.inHand = true

                // Blinds assignment
                let isBlind, blindAmount, stackLeft
                if (player.position === newHand.bbPos) { isBlind = true; blindAmount = newGame.currentBB }
                if (player.position === newHand.sbPos) { isBlind = true; blindAmount = newGame.currentSB }
                if (isBlind) {
                    stackLeft = player.currentStack - blindAmount
                    if (stackLeft < 0) {
                        player.betAmount = player.currentStack
                        player.currentStack = 0
                    } else if (stackLeft > 0) {
                        player.betAmount = blindAmount
                        player.currentStack = stackLeft
                    }
                    isBlind = false
                }
                newHand.pot = newGame.currentBB + newGame.currentSB

            })


            // Emulate bet of player in position 1
            newGame.players[0].betAmount = 50
            newGame.players[0].currentStack -= 50

            // Emulate fold of player in position 2
            newGame.players[1].inHand = false

            // Emulate call of player in position 0 (dealer)
            newHand.turnPos = 0
            newHand.endPos = 0
            newHand.pot += 50

            newGame.hands.push(newHand)

            await Promise.all([userOne.save(), userTwo.save(), userThree.save(), newGame.save()])
        })()
    })

    it('should succeed on correct data - preflop to flop', async () => {
        const result = await logic.endRound(gameId)
        expect(result).not.to.exist
        const retrievedGame = await Game.findById(gameId)
        const currentHand = retrievedGame.hands[retrievedGame.hands.length - 1]
        expect(currentHand.turnPos).to.equal(2)
        expect(currentHand.endPos).to.equal(0)
        expect(currentHand.round).to.equal(1)
        expect(currentHand.tableCards.length).to.equal(3)
        expect(currentHand.pot).to.equal(125)
        expect(retrievedGame.players[0].inHand).to.equal(true)
        expect(retrievedGame.players[1].inHand).to.equal(false)
        expect(retrievedGame.players[2].inHand).to.equal(true)
        expect(retrievedGame.players[0].betAmount).to.equal(0)
        expect(retrievedGame.players[1].betAmount).to.equal(0)
        expect(retrievedGame.players[2].betAmount).to.equal(0)
    })

    it('should succeed on correct data - flop to turn', async () => {
        // Emulating flop betting round
        const game = await Game.findById(gameId)
        game.players[0].betAmount = 300
        game.players[0].currentStack -= 300
        game.players[2].betAmount = 300
        game.players[2].currentStack -= 300
        const flopHand = game.hands[game.hands.length - 1]
        flopHand.round = 1
        flopHand.pot = 725
        flopHand.turnPos = flopHand.endPos
        await game.save()

        const result = await logic.endRound(gameId)
        expect(result).not.to.exist
        const retrievedGame = await Game.findById(gameId)
        const currentHand = retrievedGame.hands[retrievedGame.hands.length - 1]
        expect(currentHand.turnPos).to.equal(2)
        expect(currentHand.endPos).to.equal(0)
        expect(currentHand.round).to.equal(2)
        expect(currentHand.tableCards.length).to.equal(4)
        expect(currentHand.usedCards.length).to.equal(10)
        expect(currentHand.pot).to.equal(725)
        expect(retrievedGame.players[0].inHand).to.equal(true)
        expect(retrievedGame.players[1].inHand).to.equal(false)
        expect(retrievedGame.players[2].inHand).to.equal(true)
        expect(retrievedGame.players[0].betAmount).to.equal(0)
        expect(retrievedGame.players[1].betAmount).to.equal(0)
        expect(retrievedGame.players[2].betAmount).to.equal(0)
    })

    it('should succeed on correct data - turn to river', async () => {
        // Emulating turn betting round
        const game = await Game.findById(gameId)
        game.players[0].betAmount = 500
        game.players[0].currentStack -= 500
        game.players[2].betAmount = 500
        game.players[2].currentStack -= 500
        const turnHand = game.hands[game.hands.length - 1]
        turnHand.round = 2
        turnHand.pot = 1725
        turnHand.turnPos = turnHand.endPos

        // Emulate turn card dealing
        let randomCard, match
        for (i = 0; i < 1; i++) {
            do {
                randomCard = await Card.aggregate([{ $sample: { size: 1 } }])
                match = turnHand.usedCards.includes(randomCard[0])
            } while (match)
            turnHand.tableCards.push(randomCard[0])
            turnHand.usedCards.push(randomCard[0])
            match = false
        }
        await game.save()

        const result = await logic.endRound(gameId)
        expect(result).not.to.exist
        const retrievedGame = await Game.findById(gameId)
        const currentHand = retrievedGame.hands[retrievedGame.hands.length - 1]
        expect(currentHand.turnPos).to.equal(2)
        expect(currentHand.endPos).to.equal(0)
        expect(currentHand.round).to.equal(3)
        expect(currentHand.tableCards.length).to.equal(5)
        expect(currentHand.usedCards.length).to.equal(11)
        expect(currentHand.pot).to.equal(1725)
        expect(retrievedGame.players[0].inHand).to.equal(true)
        expect(retrievedGame.players[1].inHand).to.equal(false)
        expect(retrievedGame.players[2].inHand).to.equal(true)
        expect(retrievedGame.players[0].betAmount).to.equal(0)
        expect(retrievedGame.players[1].betAmount).to.equal(0)
        expect(retrievedGame.players[2].betAmount).to.equal(0)
    })

    it('should fail if game does not exist', async () => {

        await Game.deleteMany()

        try {
            await logic.endRound(gameId)
        } catch (error) {
            expect(error).to.exist
            expect(error.message).to.equal('Game does not exist.')
        }
    })

    it('should fail if only one player in hand', async () => {

        const game = await Game.findById(gameId)
        game.players.splice(0, 1)
        await game.save()

        try {
            await logic.endRound(gameId)
        } catch (error) {
            expect(error).to.exist
            expect(error.message).to.equal('Only one player in hand.')
        }
    })


    it('should fail if no hands dealt yet', async () => {

        const game = await Game.findById(gameId)
        game.hands.pop()
        await game.save()

        try {
            await logic.endRound(gameId)
        } catch (error) {
            expect(error).to.exist
            expect(error.message).to.equal('There are no hands dealt yet.')
        }
    })



    it('should fail on empty Game ID', () => {
        expect(() =>
            logic.endRound('')
        ).to.throw(Error, 'Game ID is empty or blank')
    })

    it('should fail on undefined Game ID', () => {
        expect(() =>
            logic.endRound(undefined)
        ).to.throw(Error, `Game ID with value undefined is not a valid ObjectId`)
    })

    it('should fail on non-valid data type for Game ID', () => {
        expect(() =>
            logic.endRound('aaaa')
        ).to.throw(Error, `Game ID with value aaaa is not a valid ObjectId`)
    })

    after(() => database.disconnect())
})