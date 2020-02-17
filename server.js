const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/accounts', async (req, res, next) => {
    try {
        const accounts = await db.raw(`SELECT * FROM accounts`)
        res.json(accounts)
    }catch(e){
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