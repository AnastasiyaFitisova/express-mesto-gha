const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const InternalServerError = require('../errors/InternalServerError');
const Unauthorized = require('../errors/Unauthorized');
const Conflict = require('../errors/Conflict');

const createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hash = bcrypt.hash(password, 10);
    const user = await new User({
      name, about, avatar, email, password: hash,
    }).save();
    return res.status(201).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new NotFound('Ошибка в запросе'));
    }
    if (err.code === 11000) {
      return next(new Conflict('Пользователь с таким email уже зарегистрирован'));
    }
    return next(new InternalServerError('Произошла ошибка на сервере'));
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(200).send(users);
  } catch (err) {
    return next(new InternalServerError('Произошла ошибка на сервере'));
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return next(new NotFound('Такого пользователя не существует'));
    }
    return res.status(200).send(user);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return next(new BadRequest('Ошибка в запросе'));
    }
    return next(new InternalServerError('Произошла ошибка на сервере'));
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const userId = req.user._id;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequest('Ошибка в запросе'));
    }
    return next(new InternalServerError('Произошла ошибка на сервере'));
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const userId = req.user._id;
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequest('Ошибка в запросе'));
    }
    return next(new InternalServerError('Произошла ошибка на сервере'));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new Unauthorized('Неправильные почта или пароль'));
    }
    const passwordIsValid = bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return next(new Unauthorized('Неправильные почта или пароль'));
    }
    const token = jwt.sign(
      { _id: user._id },
      'secret-key',
      { expiresIn: '7d' },
    );
    res.cookie('jwt', token, { httpOnly: true });
    return res.status(200).send(user.toJSON());
  } catch (err) {
    return next(new InternalServerError('Произошла ошибка на сервере'));
  }
};

const getUserInfo = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new NotFound('Нет данных о пользователе'));
    }
    return res.status(200).send(user);
  } catch (err) {
    return next(new InternalServerError('Произошла ошибка на сервере'));
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  login,
  getUserInfo,
};
