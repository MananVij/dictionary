const jwt = require('jsonwebtoken')
const User = require('../models/user-model')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

        if(!user) {
            throw new Error('No User Found!')
        }
        req.token = token
        req.user = user
        next()
    }catch(e) {
        // console.log(e);
        res.status(401).send({'error': 'please authenticate', 'message': e})
    }
    
}
module.exports = auth