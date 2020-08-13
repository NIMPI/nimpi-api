const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Gerar token com expiração
function generateToken(params = {}) {
  return jwt.sign(params, process.env.SECRET, {
    expiresIn: 10800
  });
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  // Verifica se o usuário está correto
  if (!user)
    return res.status(404).send({ error: 'Email or password is wrong' });

  // Verifica se a senha está correta
  if (!await bcrypt.compare(password, user.password))
    return res.status(404).send({ error: 'Email or password is wrong' });

  // Não retorna a senha para o Front-End
  user.password = undefined;

  // Retorna usuário, senha e ID do User
  res.send({ user, token: generateToken({ id: user.id }) });
};

// Verifica se está autenticado
exports.verification = (req, res, next) => {
  // Recebe o token do header
  const authHeader = req.headers.authorization;

  // Retorna erro se não possuir um token
  if (!authHeader)
    return res.status(401).send({ error: 'Sem token' });

  const parts = authHeader.split(' ');

  const [ scheme, token ] = parts;

  // Retorna erro se possuir um token sem o Bearer
  if (!/Bearer$/i.test(scheme))
    return res.status(401).send({ error: 'Token malformatted' });

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    // Retorna erro se o token estiver incorreto
    if (err)
      return res.status(401).send({ error: 'Token invalid' });

    // Passa o ID de usuário logado
    req.userId = decoded.id;
    return next();
  });
};

