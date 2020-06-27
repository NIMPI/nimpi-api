const router = require('express').Router()
const authController = require('../controllers/authController')
const documentController = require('../controllers/documentController')

router.post('/user', authController.create)
router.post('/user/login', authController.login)
router.get('/user/logout', authController.logout)

router.post('/document', documentController.insert)
router.get('/document/:id', documentController.listId)

module.exports = router
