const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    word: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    meaning: {
        type: String,
        required: true
    },
})

userSchema.statics.findByCredentials = async (word) => {
    console.log(word);
    const wordSearched = await Word.findOne({'word': word})
    if(!wordSearched) {
        throw new Error('No such word found')
    }
    return wordSearched

}

const Word = mongoose.model('Word', userSchema)
module.exports = Word