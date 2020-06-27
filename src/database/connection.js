const  mongoose = require('mongoose')
require("dotenv").config()

mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
   }, () => {
    console.log('Connected to DB!')
  })

module.exports = mongoose
