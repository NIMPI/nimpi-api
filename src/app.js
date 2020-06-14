const express = require('express')
const dotenv = require("dotenv").config()
const morgan = require('morgan')
const cors = require('cors')

const app = express()

// Import routes
const authRoute = require('./routes/auth')

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(morgan('dev'))

// Routes Middlewares
app.use('/api/v1/user', authRoute)

// API doc
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./docs/swagger.yaml')
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Server
app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT}`)
})