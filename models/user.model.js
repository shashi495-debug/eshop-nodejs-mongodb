const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
  isAdmin: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

module.exports = model('User', userSchema);