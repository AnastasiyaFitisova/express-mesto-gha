const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'name must be at least 2 characters'],
    maxlength: [30, 'link must be max 30 characters'],
  },
  about: {
    type: String,
    required: true,
    minlength: [2, 'row about must be at least 2 characters'],
    maxlength: [30, 'row about must be max 30 characters'],
  },
  avatar: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
