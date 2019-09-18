require('dotenv').config()
const { database } = require('bro-holdem-data')
const express = require('express')
const { name, version } = require('./package')
const routes = require('./routes')
const cors = require('cors')

const { env: { DB_URL, PORT } } = process

database.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {


        const app = express()

        app.use(cors())

        /*app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, keep-alive");
            next()
        })*/

        app.use('/api', routes)
        app.use(express.static('public'))

        app.listen(PORT, () => console.log(`${name} ${version} up and running on port ${PORT}`))
    })

process.on('SIGINT', () => {
    console.log(`\n${name} ${version} shutting down, disconnecting from db...`)

    database.disconnect()

    process.exit(0)
})







