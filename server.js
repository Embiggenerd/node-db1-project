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

const validateID = async (req, res, next) => {
    try {
        if (!req.params.id) {
            const noID = new Error('Updating an account requires and account ID')
            noID.httpStatusCode = 400
            throw (noID)
        }

        const account = await db.select('id').from('accounts').where({ id: req.params.id })
        if (account.length < 1) {
            const noSuchAccount = new Error('There is no account with id ' + req.params.id)
            noSuchAccount.httpStatusCode = 404
            throw (noSuchAccount)
        }

        req.accountID = req.params.id

        next()
    } catch (e) {
        next(e)
    }
}

server.put('/accounts/:id', validateID, async (req, res, next) => {
    try {
        await db('accounts')
            .where({ id: req.accountID })
            .update(req.body)

        const returnedAccount = await db.select('*')
            .from('accounts')
            .where({ id: req.accountID })

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