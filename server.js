const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/accounts', async (req, res, next) => {
    try {
        const accounts = await db.select('*')
            .from('accounts')

        res.json(accounts)
    } catch (e) {
        next(e)
    }
})


server.post('/accounts', async (req, res, next) => {
    try {
        const { name, budget } = req.body
        const newAccount = await db('accounts')
            .insert({ name, budget })
        // '.returning' method not available for sqlite
        const returnedAccount = await db.select('*')
            .from('accounts')
            .where({ id: newAccount[0] })

        res.json(returnedAccount)
    } catch (e) {
        next(e)
    }
})

server.use((err, req, res, next) => {
    console.log(err)
    res.status(err.httpStatusCode || 500).json({
        message: err.message
    })
})
module.exports = server;