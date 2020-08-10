const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

function generateToken(params = {}) {
  return jwt.sign(params, process.env.SECRET, {
    expiresIn: 10800
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user)
    return res.status(404).send({ error: 'Email or password is wrong' });

  if (!await bcrypt.compare(password, user.password))
    return res.status(404).send({ error: 'Email or password is wrong' });

  user.password = undefined;

  res.send({ user, token: generateToken({ id: user.id }) });
};

exports.verification = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).send({ error: 'Sem token' });

  const parts = authHeader.split(' ');

  const [ scheme, token ] = parts;

  if (!/Bearer$/i.test(scheme))
    return res.status(401).send({ error: 'Token malformatted' });

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err)
      return res.status(401).send({ error: 'Token invalid' });

    req.userId = decoded.id;
    return next();
  });
};

