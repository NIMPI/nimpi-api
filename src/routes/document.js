const router = require('express').Router();
const authController = require('../controllers/authController');
const documentController = require('../controllers/documentController');
const multer = require("multer");
const multerConfig = require('../config/multer');
// Importa configurações do multer
const upload = multer(multerConfig);

// Upload de arquivos
router.post('/document', authController.verification, upload.single('path'), documentController.uploadFile);

// Busca por termo
router.get('/document/findbyterm', documentController.findByTerm);

// Update de arquivos
router.put('/document/:id', authController.verification, documentController.updateFile);

module.exports = router
