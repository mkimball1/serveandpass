const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: String,
    sessions: Array
})

const UserModel = mongoose.model("Users", UserSchema)
module.exports = UserModel