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

exports.login = (req, res) => {
  User.findOne({ email: req.body.email })
      .then((dados) => {
          if (dados){
              // Cheking if the user is already in the database
              bcrypt.compare(req.body.password, dados.password, (err, resp) => {
                  if (resp){
                      jwt.sign({ email }, process.env.SECRET, { expiresIn: 86400 }, (err, token) => {
                          res.status(200)
                          res.json({ 'auth': true, 'token': token })
                      })
                  } else {
                      res.status(403)
                      res.json({ 'auth': false, 'message': 'Email or password is wrong' })
                  }
              })
          } else {
              res.status(404)
              res.send({ message: 'Email or password is wrong' })
          }
      })
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
