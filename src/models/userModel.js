const mongoose = require('mongoose');

const { Schema } = mongoose;

const User = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  enable: {
    type: Boolean,
    default: true,
  },
});

mongoose.model('user', User);
