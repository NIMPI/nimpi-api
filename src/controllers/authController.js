const router = require('express').Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

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

// Login
exports.login = async (req, res) => {
    // Cheking if the email exists
    const user = await User.findOne({ email: req.body.email })
    if(!user) return res.status(400).send('Email or password is wrong')
    // Password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send('Email or password is wrong')

    // Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET)
    res.header('auth-token', token).send({ token: token })
}

// Logout não funciona no jwt
exports.logout = (req, res) => {
  if(typeof(req.session.user) != 'undefined'){
        req.session.destroy()
        res.redirect('/')
  }
}

exports.verify = (req, res, next) => {
  const token = req.header['auth-token']
  if(!token) return res.status(401).send('Access Denied')

  try {
      const verified = jwt.verify(token, process.env.SECRET)
      req.user = verified
      next()
  } catch (error) {
      res.status(400).send('Invalid Token')
  }
}
