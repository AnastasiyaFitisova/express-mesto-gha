const User = require('../models/user');

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await new User({ name, about, avatar }).save();
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Ошибка в запросе' });
    }
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'Такого пользователя не существует' });
    }
    return res.status(200).send(user);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).send({ message: 'ID пользователя невалидный' });
    }
    return res.status(500).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, about } = req.body;
    const userId = req.user._id;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
    );
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Ошибка в запросе' });
    }
    return res.status(500).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const userId = req.user._id;
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
    );
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Ошибка в запросе' });
    }
    return res.status(500).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
};
