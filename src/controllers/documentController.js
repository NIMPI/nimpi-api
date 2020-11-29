const express = require('express');
const Document = require('../models/Document');
const Article = require('../models/Article');
const path = require('path');
const fs = require('fs');
const util = require('util');
const unlink = util.promisify(fs.unlink);

// Upload de arquivos
exports.uploadFile = async (req, res) => {
  try {
    // Implementa as variáveis com dados do body
    const { description, date, year, type, tags, articles } = req.body;
    // Implementa as variáveis com dados do arquivo original
    const { originalname: name, size, key, location: url = '' } = req.file;
    // Converte tamanho do arquivo
    const tamanho = (size / 1048576)
    // Cria novo registro no banco de dados
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
      path: url,
      size: tamanho.toFixed(2)
    });

    // Cria artigo referenciado no documento
    if(req.body.articles != null){
      await Promise.all(articles.map(async article => {
        const documentArticle = new Article({ 
          ...article,
          documentId: document._id 
        });

        await documentArticle.save();

        document.articles.push(documentArticle);
      }))
  };

    await document.save();

    return res.json(document);
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
    // Recebe o parámetro pela query
    const urlParameter = req.query.term;
    // Pagina o resultado
    const limit = parseInt(req.query.limit, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;

    // Realiza a busca no banco de dados
    const document = await Document.paginate({ title: { $regex: diacriticSensitiveRegex(urlParameter), $options: 'i' } }, { limit, page });
  
    // Validação de dados não vazios
    if (Object.keys(document).length === 0)
      return res.status(404).send({ error: 'No documents were found with that term' });
    else
      return res.json(document);

  } catch (error) {
    return res.status(400).send({ error: 'Error searching for document' });
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
    return res.json(document);
  } catch (error) {
    return res.status(404).send({ error: 'A document with this id was not found' });
  }
};

// Busca por Id
exports.findById = async (req, res) => {
  const id = req.params.id;

  try {
    // Busca o documento por Id
    const document = await Document.findById(id);
    
    return res.json(document);
  } catch (error) {
    return res.status(404).send({ error: 'A document with this id was not found' });
  }
};

// Busca todos os documentos paginado
exports.findAll = async (req, res) => {
  try {
    // Pagina o resultado
    const limit = parseInt(req.query.limit, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;

    // Busca todos os documentos paginados
    const document = await Document.paginate({}, { limit, page });

    return res.json(document);
  } catch (error) {
    return res.status(404).send({ error: 'A document with this id was not found' });
  }
};

// Deletar documentos
exports.deleteDocument = async (req, res) => {
  // Recebe o parámetro Id
  const id = req.params.id;
  // Retorna o documento
  const doc = await Document.findById(id);
  // Retorna o endereço completo de salvamento do arquivo
  const fileLocation = path.resolve(__dirname, '..', '..', 'tmp', 'uploads', doc.key);

  try {
    // Deleta o documento do banco de dados
    await Document.findByIdAndRemove(id);
    // Deleta o artigo relacionado ao documento
    await Article.deleteMany({ documentId: id });
    // Deleta o arquivo do local storage
    if (process.env.STORAGE_TYPE == local) {
      await unlink(fileLocation); 
    }

    return res.send();
  } catch (error) {
    return res.status(404).send({ error: 'No document found with this id' });
  }
};
