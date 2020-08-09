const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Login de usuário
exports.login = async (req, res) => {
  // Checa se o usuário existe
  const user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(404).send('Email or password is wrong');
  // Verifica se a senha está correta
  const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(404).send('Email or password is wrong');

  // Cria a envia o token
  const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    res.header('auth-token', token).send({ token: token });
};

// Logout não funciona no jwt
/*exports.logout = (req, res) => {
if(typeof(req.session.user) != 'undefined'){
      req.session.destroy()
      res.redirect('/')
  }
}*/

// Verifica se possue o token
exports.verify = (req, res, next) => {
  const token = req.header['auth-token'];
    if(!token) return res.status(401).send('Access Denied');

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if(err) return res.status(401).send({ error: 'Token invalid' });
      req.userId = decoded.id;
      return next();
  });
};
