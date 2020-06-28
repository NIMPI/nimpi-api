const router = require('express').Router()
const User = require('../models/User')

exports.create = async (req, res) => {
    // Cheking if the user is already in the database
    const emailExist = await User.findOne({ email: req.body.email })
    if(emailExist) return res.status(400).send('Email already exists')
  
    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)
  
    // Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    })
    try{
        const saveUser = await user.save()
        res.send({ user: user._id})
    }catch(err){
        res.status(400).send(err)
    }
  }

  exports.userAll = async (req, res) => {
    try {
        const user = await User.find({}, {password:0})

        return res.send({ user })
    } catch (error) {
        return res.status(400).send({ error: "Error loading users" })
    }
}


