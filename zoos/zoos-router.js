const router = require('express').Router();
const knex = require('knex');

const knexConfig = {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        filename: './data/lambda.sqlite3'
    }
}

const db = knex(knexConfig)

router.get('/', async (req,res) => {
    try {
        const zoos = await db('zoos')
        res.status(200).json(zoos) 
    } catch (error) {
        res.status(500).json(error)
    }
})

router.post('/', async (req,res) => {
    try {
        const [id] = await db('zoos')
            .insert(req.body)
        const zoo = await db('zoos')
            .where({ id })
            .first()
        
        res.status(201).json(zoo)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router