const express = require('express');

const {
  createUser, getUsers, getUserById, updateProfile, updateAvatar,
} = require('../controllers/users');

const userRoutes = express.Router();

userRoutes.post('/', createUser); // создает пользователя
userRoutes.get('/', getUsers); // возвращает всех пользователей
userRoutes.get('/:userId', getUserById); // возвращает пользователя по _id
userRoutes.patch('/me', updateProfile); // обновляет профиль
userRoutes.patch('/me/avatar', updateAvatar); // обновляет аватар

module.exports = {
  userRoutes,
};
