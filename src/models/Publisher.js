const mongoose = require('../database/connection');
const mongoosePaginate = require('mongoose-paginate-v2');

// Schema de authores
const publisherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

publisherSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Publisher', publisherSchema);
