const mongoose = require('../database/connection');
const mongoosePaginate = require('mongoose-paginate-v2');

// Schema de autores
const publisherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

// Plugin de paginação
publisherSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Publisher', publisherSchema);
