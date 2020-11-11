const router = require('express').Router();
const authController = require('../controllers/authController');
const articleController = require('../controllers/articleController');

// Busca por termo
router.get('/article/findbyterm', articleController.findByTerm);

// Busca todos
router.get('/article', articleController.findAll);

// Busca por Id
router.get('/article/:id', articleController.findById);

// Update de artigos
router.put('/article/:id', authController.verification, articleController.updateArticle);

// Delete artigos
router.delete('/article/:id', authController.verification, articleController.deleteArticle);

module.exports = router;
