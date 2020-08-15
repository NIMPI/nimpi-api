const multer = require('multer');
const multerConfig = require('../config/multer');
const Document = require('../models/Document');

// Upload de arquivos
exports.uploadFile = async (req, res) => {
  try {
    // Define nome de algumas variáveis
    const { originalname: name, size, key, location: url = '' } = req.file;
        
    // Criando novo registro no banco de dados
    const document = await Document.create({
      title: req.body.title || name,
      description: req.body.description,
      tags: req.body.tags,
      date: req.body.date,
      year: req.body.year,
      type: req.body.type,
      userId: req.userId,
      key,
      path: url
    });
    return res.json(document);
  } catch (error) {
    return res.status(400).send({ error: 'Error creating new document' });
  }
};

// Busca por termo
exports.findByTerm = async (req, res, next) => {
  
  function diacriticSensitiveRegex(string = '') {
    return string.replace(/a/g, '[a,á,à,ã,â,ä]')
      .replace(/e/g, '[e,é,ë,è,ê,ẽ]')
      .replace(/i/g, '[i,í,ï,ì,ĩ,î]')
      .replace(/o/g, '[o,ó,ö,ò,õ,ô]')
      .replace(/u/g, '[u,ü,ú,ù,ũ,û]')
      .replace(/c/g, '[c,ç]');
  }
  
  try {
    const urlParameter = req.query.term;

  //  const document = await Document.find({ title: { $regex: urlParameter, $options: 'i' } })
  //  const document = await Document.find({ title: { $regex: diacriticSensitiveRegex(urlParameter), $options: 'i' } })
    const document = await Document.find({ tags: { $regex: diacriticSensitiveRegex(urlParameter), $options: 'i' } })
  

    if (Object.keys(document).length === 0)
      return res.status(404).send({ error: 'No documents were found with that term' });
    else
      return res.json(document);

  } catch (err) {
    return res.status(400).send({ error: 'Error searching for document' });
  }
}

// Alterar documentos

