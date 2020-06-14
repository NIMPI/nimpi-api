const mongoose = require('../database/connection')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    enable: {
        type: String,
        default: true
    }  
})

const User = mongoose.model('User', userSchema, 'users')
module.exports = User
