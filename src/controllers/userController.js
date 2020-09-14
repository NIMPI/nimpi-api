const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.create = async (req, res) => {
    // Verifica se o usuário consta no banco de dados
    const emailExist = await User.findOne({ email: req.body.email });
    if(emailExist) return res.status(400).send('Email already exists');
  
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
        res.send({ user: user._id});
    }catch(err){
        res.status(400).send(err)
    }
  };

  // Lista todos os usuários
  exports.userAll = async (req, res) => {
    try {
      const limit = parseInt(req.query.limit, 10) || 10;
      const page = parseInt(req.query.page, 10) || 1;
      const user = await User.paginate({}, {password:0}, { limit, page })

      return res.json(user);
    } catch (error) {
        return res.status(400).send({ error: "Error loading users" + console.log(error) })
    }
}

// Listar por Id
exports.userById = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    return res.json(user);
  } catch (error) {
    return res.status(404).send({ error: 'A user with this id was not found' + console.log(error) });
  }
};

// Alterar usuário
exports.updateUser = async (req, res) => {
  try {
      // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // Busca por Id e altera os dados do documento
    const user = await User.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      email: req.body.email,
      password: hashPassword
    }, { new: true });
    return res.json(user + console.log(user));
  } catch (error) {
    return res.status(404).send({ error: 'A user with this id was not found: ' + console.log(error) });
  }
};

// Deletar usuários
exports.deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    await User.findByIdAndRemove(id);

    return res.send();
  } catch (error) {
    return res.status(404).send({ error: 'No user found with this id' + console.log(error) });
  }
};
