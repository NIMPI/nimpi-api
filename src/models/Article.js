//const mongoose = require('mongoose');
const mongoose = require('../database/connection');

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  subtitle: {
    type: String,
  },
  authors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Publisher'
  }],
  content: {
    type: String
  },
  imagesList: {
    type: String
  },
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    require: true
  }
})

module.exports = mongoose.model("Article", ArticleSchema);
