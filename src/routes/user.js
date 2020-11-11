const router = require('express').Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

// Criar usuário
router.post('/user', authController.verification, userController.create);

// Listar todos os usuários
router.get('/user/all', authController.verification, userController.userAll);

// Listar usuário por Id
router.get('/user/:id', authController.verification, userController.userById);

// Alterar usuário
router.put('/user/:id', authController.verification, userController.updateUser);

// Deletar usuário
router.delete('/user/:id', authController.verification, userController.deleteUser);

module.exports = router;
