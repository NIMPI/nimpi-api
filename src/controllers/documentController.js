const multer = require('multer');
const multerConfig = require('../config/multer');
const Document = require('../models/document');

// Uploado de arquivos
exports.uploadFile = async (req, res) => {
  try {
    // Define nome de algumas variáveis
    const { originalname: name, size, key, location: url = '' } = req.file;
    title = name;
    path = url;
    
    // Criando novo registro no banco de dados
    const document = await Document.create({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      year: req.body.year,
      userId: req.userId,
      key,
      path
    });
    return res.json(document);
  } catch (error) {
    return res.status(400).send({ error: 'Error creating new document' });
  }
};

// Busca por termo
exports.findByTerm = async (req, res, next) => {
  try {
    const urlParameter = req.query.term;

    const document = await Document.find({ title: { $regex: urlParameter } })
    
    return res.json(document);
  } catch (err) {
    return res.status(400).send({ error: 'Error searching for document' });
  }
}

/* 
exports.update = async (req, res) => {
  try {
    const { title, description, date, year, publisherId,  }
  } catch (error) {
    
  }
};
*/