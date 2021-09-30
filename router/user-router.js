const express = require('express')
const router = new express.Router()

const User = require('../models/user-model')
const Word = require('../models/word-model')

const bcrypt = require('bcryptjs')
const auth = require('../middleware/auth')
const sharp = require('sharp')
const { response } = require('express')


// ------   SignUp   -----

router.post('/signup', async (req, res) => {
    const user = new User(req.body)
    const token = await user.geterateAuthToken()
    console.log(user);
    user.save().then(() => {
        res.send({user, token})
    }).catch((e) => {
        res.send(e).status(400)
    })
})

// ------login------
router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.geterateAuthToken()
        req.user = user
        res.send(user)

    } catch (e) {
        res.status(404).send('User Not Found')
    }
})

//--------      logout      --------
router.post('/logout', auth, async (req, res, next) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send('Successfully Logged Out')
    } catch (e) {
        res.status(500).send(e)
    }
})

// -----        logout from all devices         -------
router.post('/logoutall', auth, async(req, res, next) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.send().status(500)
    }
})

// -----        change to admin         ----
router.patch('/changetoadmin', auth, async (req, res) => {

    if(req.user.isAdmin === false) {
        console.log('You are not an admin. Only existing admins can change users to admin')
        return res.send('You are not an admin. Only existing admins can change users to admin')
    }

    try {

        if(!req.body.email) {
            console.log('Enter Email of User whom you want to make admin')
            return res.status().send('Enter Email of User whom you want to make admin')
        }

        const user = await User.findByCredentialsForUpgrading(req.body.email)

        res.send('User changed to admin')
        console.log('User changed to admin')
    
    } catch (e) {
        res.status(404).send('No User Found')
    }

})



module.exports = router