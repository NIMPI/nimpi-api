const  mongoose = require('mongoose');

require('dotenv').config();

// Conexão com o banco de dados MongoDB
mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
   }, () => {
    console.log('Connected to DB!');
  });

module.exports = mongoose
