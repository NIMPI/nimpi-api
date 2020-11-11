const router = require('express').Router();
const authController = require('../controllers/authController');
const publisherController = require('../controllers/publisherController');

// Criar autores
router.post('/publisher', authController.verification, publisherController.createPublisher);

// Busca por nome
router.get('/publisher/findbyterm', publisherController.findByTerm);

// Busca por Id
router.get('/publisher/:id', publisherController.findById);

// Listar todos
router.get('/publisher/all', publisherController.findAll);

// Alterar autores
router.put('/publisher/:id', authController.verification, publisherController.updatePublisher);

// Deletar autores
router.delete('/publisher/:id', authController.verification, publisherController.deletePublisher);

module.exports = router;
