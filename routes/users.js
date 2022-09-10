const express = require('express');

const {
  createUser, getUsers, getUserById, updateProfile, updateAvatar,
} = require('../controllers/users');

const userRoutes = express.Router();

userRoutes.post('/users', express.json(), createUser); // создает пользователя
userRoutes.get('/users', express.json(), getUsers); // возвращает всех пользователей
userRoutes.get('/users/:userId', express.json(), getUserById); // возвращает пользователя по _id
userRoutes.patch('/users/me', express.json(), updateProfile); // обновляет профиль
userRoutes.patch('/users/me/avatar', express.json(), updateAvatar); // обновляет аватар

module.exports = {
  userRoutes,
};
