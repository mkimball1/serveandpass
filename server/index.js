const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors')

const UserModel = require('./models/Users')

const app = express()
app.use(cors())
app.use(express.json())

DB_URL = "mongodb+srv://serveandpass:momo123@serveandpass.1kzsj1q.mongodb.net/ServeAndPass"
mongoose.connect(DB_URL)

//USER FUNCTIONS
app.get('/getUsers', (req, res) => {
    UserModel.find()
    .then(users => res.json(users))
    .catch(err => res.json(err))
})
app.post("/createUser", async (req, res) => {
    const user = req.body
    const newUser = new UserModel(user)
    await newUser.save()
    res.json(user)
})

PORT = 3001
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

console.log("im gonna kill myself")
// console.log(UserModel)