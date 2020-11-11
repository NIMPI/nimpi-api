const mongoose = require('../database/connection');
const mongoosePaginate = require('mongoose-paginate-v2');

// Schema de artigos
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
});

// Plugin de paginação
ArticleSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Article", ArticleSchema);
