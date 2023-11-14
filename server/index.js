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

app.put('/getUserByName/:username', (req, res) => {
    const username = req.params.username; // Extract the username from the request parameters
    const updateData = req.body; // This will contain the data you want to update

    UserModel.findOneAndUpdate(
        { username: username }, // Filter to find the user
        updateData, // Data for updating the user
        { new: true } // Option to return the updated document
    )
    .then(updatedUser => {
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        res.json(updatedUser); // Send back the updated user data
    })
    .catch(err => res.status(500).json(err));
});





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