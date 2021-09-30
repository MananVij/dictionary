const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const port = process.env.PORT
const mongoose = require('./db/mongoose');

const express = require('express')
const app = express();
const cors = require('cors')
app.use(cors())
const request = require('request')
// const fetch = require('node-fetch')


const User = require('./models/user-model')
const Word = require('./models/word-model')
const userRouter = require('./router/user-router')
const wordRouter = require('./router/word-router')
const { ObjectId } = require('mongodb')
const { ObjectID } = require('bson')

app.use(express.json())

app.use(userRouter)
app.use(wordRouter)         


app.listen(port, () => {
    console.log(`listening on port ${port}`);
})