const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Cria novo usuário
exports.create = async (req, res) => {
    // Verifica se o usuário consta no banco de dados
    const emailExist = await User.findOne({ email: req.body.email });
    if(emailExist) 
      return res.status(400).send('Email already exists');
  
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
  
    // Cria novo usuário
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });

    try{
        const saveUser = await user.save();
        // Envia o Id do usuário que fez login
        res.send({ user: user._id });
    }catch(err){
        res.status(400).send(err)
    }
  };

  // Lista todos os usuários
  exports.userAll = async (req, res) => {
    try {
      // Pagina o resultado
      const limit = parseInt(req.query.limit, 10) || 10;
      const page = parseInt(req.query.page, 10) || 1;
      // Retorna a busca paginada
      const user = await User.paginate({}, {password:0}, { limit, page })

      return res.json(user);
    } catch (error) {
        return res.status(400).send({ error: "Error loading users" })
    }
}

// Listar por Id
exports.userById = async (req, res) => {
  // Recebe o parâmetro Id
  const id = req.params.id;

  try {
    // Retorna busca por Id
    const user = await User.findById(id);

    return res.json(user);
  } catch (error) {
    return res.status(404).send({ error: 'A user with this id was not found' });
  }
};

// Alterar usuário
exports.updateUser = async (req, res) => {
  // Recebe o parâmetro Id
  const id = req.params.id;

  try {
      // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // Busca por Id e altera os dados do documento
    const user = await User.findByIdAndUpdate(id, {
      name: req.body.name,
      email: req.body.email,
      password: hashPassword
    }, { new: true });

    return res.json(user);
  } catch (error) {
    return res.status(404).send({ error: 'A user with this id was not found' });
  }
};

// Deletar usuários
exports.deleteUser = async (req, res) => {
  // Recebe o parâmetro Id
  const id = req.params.id;

  try {
    // Busca por Id e deleta
    await User.findByIdAndRemove(id);

    return res.send();
  } catch (error) {
    return res.status(404).send({ error: 'No user found with this id' });
  }
};
