const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    email: {
        required: true,
        unique: true,
        type: String,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Incorrect Email Id')
            }
        }
    }, password: {
        type: String,
        required: true
    }, 
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
})

userSchema.methods.geterateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ "_id" : user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token: token})
    // console.log(token);
    // return user.tokens
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    console.log(email, password);
    const user = await User.findOne({'email': email})
    if(!user) {
        throw new Error('No user found')
    }
    const passMatch = await bcryptjs.compare(password, user.password)
    if(!passMatch) {
        throw new Error('Please check credentials')
    }
    return user

}

userSchema.statics.findByCredentialsForUpgrading = async (email) => {
    // const user = await User.find({'email': email})
    const user = await User.findOneAndUpdate({email: email}, {isAdmin: true})
    if(!user) {
        throw new Error('No user found')
    }
    user.save()
    return user
}


userSchema.pre('save', async function (next){
    const user = this
    if(user.isModified('password')) {
        user.password = await bcryptjs.hash(user.password, 8)
    }
    // console.log(user);
    // console.log('before saving ');    
    next()
})

const User = mongoose.model('Admin', userSchema)
module.exports = User