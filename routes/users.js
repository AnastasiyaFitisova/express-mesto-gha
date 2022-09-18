const express = require('express');

const {
  getUsers, getUserById, updateProfile, updateAvatar, getUserInfo,
} = require('../controllers/users');

const userRoutes = express.Router();

userRoutes.get('/', getUsers); // возвращает всех пользователей
userRoutes.get('/:userId', getUserById); // возвращает пользователя по _id
userRoutes.patch('/me', updateProfile); // обновляет профиль
userRoutes.patch('/me/avatar', updateAvatar); // обновляет аватар
userRoutes.get('/me', getUserInfo); // возвращает информацию о текущем пользователе

module.exports = {
  userRoutes,
};
