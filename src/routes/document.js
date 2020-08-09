const router = require('express').Router();
const authController = require('../controllers/authController');
const documentController = require('../controllers/documentController');
const multer = require("multer");
const multerConfig = require('../config/multer');
// Importa configurações do multer
const upload = multer(multerConfig);

// Upload de arquivos
router.post('/document', upload.single('file'), documentController.uploadFile);

// Busca por termo
router.get('/document/findbyterm/:title', documentController.findByTerm)

module.exports = router
