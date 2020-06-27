const router = require('express').Router()
const auth = require('../controllers/authController')
const Document = require('../models/Document')

exports.insert = async (req, res) => {
    try {
        const document = await Document.create({ ...req.body, user: req.userId })

        return res.send({ document })
    } catch (error) {
        return res.status(400).send({ error: "Error creating new document" })
    }
}

exports.listId = async (req, res) => {
    try {
        const document = await Document.find()

        return res.send({ document })
    } catch (error) {
        return res.status(400).send({ error: "Error loading documents" })
    }
}
