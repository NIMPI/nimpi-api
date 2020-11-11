const mongoose = require('../database/connection');
const mongoosePaginate = require('mongoose-paginate-v2');

// Schema de usuário
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  enable: {
    type: String,
    default: true
  }
});

// Plugin de paginação
userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', userSchema);
