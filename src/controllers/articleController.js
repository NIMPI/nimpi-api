const Article = require('../models/Article');

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
    const limit = parseInt(req.query.limit, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;

    // Realiza a busca no banco de dados
    const article = await Article.paginate({ title: { $regex: diacriticSensitiveRegex(urlParameter), $options: 'i' } }, { limit, page });
  
    // Validação de dados não vazios
    if (Object.keys(article).length === 0)
      return res.status(404).send({ error: 'No articles were found with that term ' + console.log(error) });
    else
      return res.json(article + console.log(article));

  } catch (error) {
    return res.status(400).send({ error: 'Error searching for article ' + console.log(error) });
  }
};

// Alterar artigos
exports.updateArticle = async (req, res) => {
  try {
    // Define as variáveis com dados do body
    const {title, subtitle, authors, content, imageList, documentId} = req.body;
    // Busca por Id e altera os dados do artigo
    const article = await Article.findByIdAndUpdate(req.params.id, {
      title,
      subtitle,
      authors,
      content,
      imageList,
      documentId
    }, { new: true });
    return res.json(article + console.log(article));
  } catch (error) {
    return res.status(404).send({ error: 'A article with this id was not found: ' + console.log(error) });
  }
};

// Busca por Id
exports.findById = async (req, res) => {
  const id = req.params.id;

  try {
    const article = await Article.findById(id);

    return res.json(article);
  } catch (error) {
    return res.status(404).send({ error: 'A article with this id was not found' + console.log(article) });
  }
};

// Busca todos os artigos paginado
exports.findAll = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;
    const article = await Article.paginate({}, { limit, page });

    return res.json(article);
  } catch (error) {
    return res.status(404).send({ error: 'A article with this id was not found' + console.log(article) });
  }
};

// Deletar artigos
exports.deleteArticle = async (req, res) => {
  const id = req.params.id;

  try {
    await Article.findByIdAndRemove(id);

    return res.send();
  } catch (error) {
    return res.status(404).send({ error: 'No article found with this id' + console.log(error) });
  }
};
