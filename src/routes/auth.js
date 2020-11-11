const router = require('express').Router();
const authController = require('../controllers/authController');

// Login de usuário
router.post('/user/login', authController.login);

module.exports = router;
