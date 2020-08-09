require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();

// Importa as rotas
const authRoute = require('./routes/auth');
const documentRoute = require('./routes/document');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

// Cria url do arquivo armazenado
app.use(
  '/files',
  express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
);

// Versão da API
const api_version = process.env.API_VERSION;

// Rota dos Middlewares
app.use(`/${api_version}`, authRoute);
app.use(`/${api_version}`, documentRoute);

// API doc
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/swagger.yaml');
app.use(`/${api_version}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Server
app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
