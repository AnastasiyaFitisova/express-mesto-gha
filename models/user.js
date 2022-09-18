const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'name must be at least 2 characters'],
    maxlength: [30, 'link must be max 30 characters'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: true,
    minlength: [2, 'row about must be at least 2 characters'],
    maxlength: [30, 'row about must be max 30 characters'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'E-mail is not valid',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.methods.toJSON = function passwordDelete() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('user', userSchema);
