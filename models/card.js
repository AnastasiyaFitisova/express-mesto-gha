const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'name must be at least 2 characters'],
    maxlength: [30, 'name must be max 30 characters'],
  },
  link: {
    type: String,
    required: true,
    minlength: [2, 'link must be at least 2 characters'],
    maxlength: [30, 'link must be max 30 characters'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', userSchema);
