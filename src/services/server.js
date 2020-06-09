const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// Database
mongoose.connect(process.env.DATABASE_CONNECTION_STRING, {
  useUnifiedTopology: true,
  useFindAndModify: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

const db = mongoose.connection;

db.on('connected', () => {
  console.log('Mongoose default connection is open');
});

db.on('error', (err) => {
  console.log(`Mongoose default connection has occured \n${err}`);
});

db.on('disconnected', () => {
  console.log('Mongoose default connection is disconnected');
});

process.on('SIGINT', () => {
  db.close(() => {
    console.log(
      'Mongoose default connection is disconnected due to application termination',
    );
    process.exit(0);
  });
});

const app = express();

const port = process.env.PORT;
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => {
  console.log(`Servidor Rodando na Porta  ${port}`);
});

module.exports
