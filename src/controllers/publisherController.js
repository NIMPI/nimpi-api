const Publisher = require('../models/Publisher');

// Criar autores
exports.createPublisher = async (req, res) => {
  try {
    const publisher = await Publisher.create({
      name: req.body.name
    });

    await publisher.save();

    return res.json(publisher);
  } catch (error) {
    return res.status(400).send({ error: 'Error creating new publisher' });
  }
};

// Busca por nome
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
    // Recebe o parâmetro
    const urlParameter = req.query.term;

    // Pagina o resultado
    const limit = parseInt(req.query.limit, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;

    // Realiza a busca no banco de dados
    const publisher = await Publisher.paginate({ name: { $regex: diacriticSensitiveRegex(urlParameter), $options: 'i' } }, { limit, page });
  
    // Validação de dados não vazios
    if (Object.keys(publisher).length === 0)
      return res.status(404).send({ error: 'No publisher were found with that term' });
    else
      return res.json(publisher);

  } catch (error) {
    return res.status(400).send({ error: 'Error searching for publisher' });
  }
};

// Alterar autores
exports.updatePublisher = async (req, res) => {
  // Recebe o parâmetro Id
  const id = req.params.id;
  try {
    // Recebe o parâmetro Id e altera o nome
    const publisher = await Publisher.findByIdAndUpdate(id, {
      name: req.body.name
      // Retorna o update
    }, { new: true });

    return res.json(publisher);
  } catch (error) {
    return res.status(404).send({ error: 'A publisher with this id was not found' });
  }
};

// Busca por Id
exports.findById = async (req, res) => {
  // Recebe o parâmetro Id
  const id = req.params.id;

  try {
    // Realiza a busca por Id
    const publisher = await Publisher.findById(id);

    return res.json(publisher);
  } catch (error) {
    return res.status(404).send({ error: 'A publisher with this id was not found' });
  }
};

// Listar todos os autores paginado
exports.findAll = async (req, res) => {
  try {
    // Pagina o resultado
    const limit = parseInt(req.query.limit, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;

    // Retorna os dados paginados
    const publisher = await Publisher.paginate({}, { limit, page });

    return res.json(publisher);
  } catch (error) {
    return res.status(404).send({ error: 'A publisher with this id was not found' });
  }
};

// Deletar autores
exports.deletePublisher = async (req, res) => {
  // Recebe o parâmetro Id
  const id = req.params.id;

  try {
    // Busca e Deleta pelo Id
    await Publisher.findByIdAndRemove(id);
    
    return res.send();
  } catch (error) {
    return res.status(404).send({ error: 'No publisher found with this id' });
  }
};
