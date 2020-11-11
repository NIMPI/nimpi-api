const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Gera o token e coloca tempo para expiração
function generateToken(params = {}) {
  return jwt.sign(params, process.env.SECRET, {
    expiresIn: 21600
  });
};

// Login
exports.login = async (req, res) => {
  // Recebe login e senha
  const { email, password } = req.body;

  // Busca o login e senha no user
  const user = await User.findOne({ email }).select('+password');

  // Se o login digitado for diferente do armazenado no banco de dados
  if (!user)
    return res.status(404).send({ error: 'Email or password is wrong' });

  // Se a senha for diferente do armazenado no banco de dados
  if (!await bcrypt.compare(password, user.password))
    return res.status(404).send({ error: 'Email or password is wrong' });

  user.password = undefined;

  // Envia o token com os dados do usuário
  res.send({ user, token: generateToken({ id: user.id }) });
};

// Verifica o token
exports.verification = (req, res, next) => {
  const authHeader = req.body.token || req.query.token || req.headers.token || req.headers.authorization || req.headers['access-token'];

  // Se o token for vazio
  if (!authHeader)
    return res.status(401).send({ error: 'No token' });

  const parts = authHeader.split(' ');

  const [ scheme, token ] = parts;

  // Se o token não conter o Bearer
  if (!/Bearer$/i.test(scheme))
    return res.status(401).send({ error: 'Token malformatted' });

  // Se o token for diferente ou expirado
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err)
      return res.status(401).send({ error: 'Token invalid' });

    // Coleta do Id do user que fez o login
    req.userId = decoded.id;

    // Token correto
    return next();
  });
};
