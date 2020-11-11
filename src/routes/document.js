const router = require('express').Router();
const authController = require('../controllers/authController');
const documentController = require('../controllers/documentController');
const multer = require("multer");
const multerConfig = require('../config/multer');

// Importa configurações do multer
const upload = multer(multerConfig);

// Upload de documentos
router.post('/document', authController.verification, upload.single('path'), documentController.uploadFile);

// Busca por termo
router.get('/document/findbyterm', documentController.findByTerm);

// Busca por Id
router.get('/document/:id', documentController.findById);

// Busca todos
router.get('/document', documentController.findAll);

// Update de documentos
router.put('/document/:id', authController.verification, documentController.updateFile);

// Deletar documentos
router.delete('/document/:id', authController.verification, documentController.deleteDocument);

module.exports = router;
