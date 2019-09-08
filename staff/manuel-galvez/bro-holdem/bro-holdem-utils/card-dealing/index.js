const { Card } = require('../../models')

async function cardDealing(destArray, numberOfCards, usedCards) {

    let randomCard, match

    for (i = 0; i < numberOfCards; i++) {
        do {
            randomCard = await Card.aggregate([{ $sample: { size: 1 } }])
            match = usedCards.includes(randomCard[0])
        } while (match)
        destArray.push(randomCard[0])
        usedCards.push(randomCard[0])
        match = false
    }
}

module.exports = cardDealing