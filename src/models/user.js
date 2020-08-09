const mongoose = require('../database/connection');

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
    required: true
  },
  enable: {
    type: String,
    default: true
  }
});

module.exports = mongoose.model('User', userSchema);
