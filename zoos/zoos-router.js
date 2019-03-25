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

router.get('/:id', async (req,res) => {
    try {
        const zoo = await db('zoos')
            .where({ id: req.params.id })
            .first()
        res.status(200).json(zoo)    
    } catch {
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

router.put('/:id', async (req,res) => {
    try {
        const count = await db('zoos')
            .where({ id: req.params.id })
            .update(req.body)

        if (count > 0) {
            const zoo = await db('zoos')
                .where({id: req.params.id })
                .first()
            res.status(200).json(zoo)    
        } else {
            res.status(404).json({
                message: "Zoos not found"
            })
        }   
    } catch (error) {
        res.status(500).json(error)
    }
})

router.delete('/:id', async (req,res) => {
    try {
        const count = await db('zoos')
            .where({ id: req.params.id })
            .del()

        if (count > 0) {
            res.status(200).json(count)
        } else {
            res.status(404).json({
                message: "Zoo not found"
            })
        } 
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router