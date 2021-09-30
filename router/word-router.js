const express = require('express')
const Word = require('../models/word-model')

const auth = require('../middleware/auth')
// const { update } = require('../src/models/tasks')
const router = new express.Router()

router.post('/postword', auth, async(req, res) => {

    if(req.user.isAdmin === false) {
        console.log('You are not an admin')
        return res.send('You are not an admin')
    }

    const word = new Word ({
        word: req.body.word,
        meaning: req.body.meaning,
    })
    try {
        await word.save()
        res.status(201).send(word)
    } catch (e) {
        res.send(e.message).status(400);
    }
})
router.get('/getword', async (req, res, next) => {
    
    try {
        const word = await Word.findByCredentials(req.body.word)
        // req.user = user
        console.log(word)
        res.send(word)

    } catch (e) {
        res.status(404).send('User Not Found')
    }
  
})

router.delete('/deleteword', auth, async (req, res) => {

    if(req.user.isAdmin === false) {
        console.log('You are not an admin')
        return res.send('You are not an admin')
    }
    try {
        const word = await Word.findOneAndDelete({word: req.body.word})
        if(!word) {
            return res.status(404).send({'error': 'No word found'})
        }
    } catch (error) {
        res.send('Sever error').status(500)
    }
})

module.exports = router