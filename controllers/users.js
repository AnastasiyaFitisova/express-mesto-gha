const User = require('../models/user');

const {
  badRequest, notFound, internalServerError,
} = require('../errors/errors');

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await new User({ name, about, avatar }).save();
    return res.status(201).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(notFound).send({ message: 'Ошибка в запросе' });
    }
    return res.status(internalServerError).send({ message: 'Произошла ошибка на сервере' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).send(users);
  } catch (err) {
    return res.status(internalServerError).send({ message: 'Произошла ошибка на сервере' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(notFound).send({ message: 'Такого пользователя не существует' });
    }
    return res.status(200).send(user);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(badRequest).send({ message: 'Ошибка в запросе' });
    }
    return res.status(internalServerError).send({ message: 'Произошла ошибка на сервере' });
  }
};

const updateProfile = async (req, res) => {
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
      return res.status(badRequest).send({ message: 'Ошибка в запросе' });
    }
    return res.status(internalServerError).send({ message: 'Произошла ошибка на сервере' });
  }
};

const updateAvatar = async (req, res) => {
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
      return res.status(badRequest).send({ message: 'Ошибка в запросе' });
    }
    return res.status(internalServerError).send({ message: 'Произошла ошибка на сервере' });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
};
