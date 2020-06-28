const router = require('express').Router()
const authController = require('../controllers/authController')
const documentController = require('../controllers/documentController')
const userController = require('../controllers/userController')

router.post('/user', userController.create)
router.get('/user/all', userController.userAll)

router.post('/user/login', authController.login)
router.get('/user/logout', authController.logout)

router.post('/document', documentController.insert)
router.get('/document/all', documentController.listId)

module.exports = router
