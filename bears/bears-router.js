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
        const bears = await db('bears')
        res.status(200).json(bears) 
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/:id', async (req,res) => {
    try {
        const bear = await db('bears')
            .where({ id: req.params.id })
            .first()
        res.status(200).json(bear)    
    } catch {
        res.status(500).json(error)
    }
})

function propertyChecker(req,res,next) {
    if (!req.body.hasOwnProperty('name')) {
        res.status(400).json({
            message: "Please include a name"
        })
    } else {
        next()
    }
}

router.post('/', propertyChecker, async (req,res) => {
    try {
        const [id] = await db('bears')
            .insert(req.body)
        // const bear = await db('bears')
        //     .where({ id })
        //     .first()
        
        res.status(201).json(id)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.put('/:id', propertyChecker, async (req,res) => {
    try {
        const count = await db('bears')
            .where({ id: req.params.id })
            .update(req.body)

        if (count > 0) {
            const bear = await db('bears')
                .where({id: req.params.id })
                .first()
            res.status(200).json(bear)    
        } else {
            res.status(404).json({
                message: "Bears not found"
            })
        }   
    } catch (error) {
        res.status(500).json(error)
    }
})

router.delete('/:id', async (req,res) => {
    try {
        const count = await db('bears')
            .where({ id: req.params.id })
            .del()

        if (count > 0) {
            res.status(200).json(count)
        } else {
            res.status(404).json({
                message: "Bear not found"
            })
        } 
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router