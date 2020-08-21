const Document = require('../models/Document');
const Article = require('../models/Article');
const multer = require('multer');

// Upload de arquivos
exports.uploadFile = async (req, res) => {
  try {
    // Implementa as variáveis com dados do body
    const {description, date, year, type, tags} = req.body;
    // Implementa as variáveis com dados do arquivo original
    const { originalname: name, size, key, location: url = '' } = req.file;
        
    // Criando novo registro no banco de dados
    const document = await Document.create({
      title: req.body.title || name,
      description,
      tags,
      date,
      year,
      type,
      userId: req.userId,
      dateCreated: Date.now(),
      key,
      path: url
    });

    return res.json(document + console.log(document));
  } catch (error) {
    return res.status(400).send({ error: 'Error creating new document ' + console.log(error) });
  }
};

// Busca por termo
exports.findByTerm = async (req, res, next) => {
  
  // Converte os acentos em letras simples
  function diacriticSensitiveRegex(string = '') {
    return string.replace(/a/g, '[a,á,à,ã,â,ä]')
      .replace(/e/g, '[e,é,ë,è,ê,ẽ]')
      .replace(/i/g, '[i,í,ï,ì,ĩ,î]')
      .replace(/o/g, '[o,ó,ö,ò,õ,ô]')
      .replace(/u/g, '[u,ü,ú,ù,ũ,û]')
      .replace(/c/g, '[c,ç]');
  };  
  try {
    const urlParameter = req.query.term;


    // Realiza a busca no banco de dados
    const document = await Document.find({ title: { $regex: diacriticSensitiveRegex(urlParameter), $options: 'i' } });
    //const document = await Document.find({ tags: { $regex: diacriticSensitiveRegex(urlParameter), $options: 'i' } });
  
    // Validação de dados não vazios
    if (Object.keys(document).length === 0)
      return res.status(404).send({ error: 'No documents were found with that term ' + console.log(error) });
    else
      return res.json(document + console.log(document));

  } catch (error) {
    return res.status(400).send({ error: 'Error searching for document ' + console.log(error) });
  }
};

// Alterar documentos
exports.updateFile = async (req, res) => {
  try {
    // Define as variáveis com dados do body
    const {title, description, date, year, type, tags} = req.body;
    // Busca por Id e altera os dados do documento
    const document = await Document.findByIdAndUpdate(req.params.id, {
      title,
      description,
      date,
      year,
      type,
      tags,
      userId: req.userId,
      lastModification: Date.now()
    }, { new: true });
    return res.json(document + console.log(document));
  } catch (error) {
    return res.status(404).send({ error: 'A document with this id was not found: ' + console.log(error) });
  }
};

// Busca por Id
exports.findById = async (req, res) => {
  const id = req.params.id;

  try {
    const document = await Document.findById(id);

    return res.json(document);
  } catch (error) {
    return res.status(404).send({ error: 'A document with this id was not found' + console.log(document) });
  }
};

// Busca todos os documentos
exports.findAll = async (req, res) => {
  try {
    const document = await Document.find();

    return res.json(document);
  } catch (error) {
    return res.status(404).send({ error: 'A document with this id was not found' + console.log(document) });
  }
};
