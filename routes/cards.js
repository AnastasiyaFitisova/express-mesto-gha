const express = require('express');

const {
  getCards, createCard, deleteCard, putLike, deleteLike,
} = require('../controllers/cards');

const cardRoutes = express.Router();

cardRoutes.get('/cards', express.json(), getCards); // возвращает все карточки
cardRoutes.post('/cards', express.json(), createCard); // создает карточку
cardRoutes.delete('/cards/:cardId ', express.json(), deleteCard); // удаляет карточку
cardRoutes.put('/cards/:cardId/likes ', express.json(), putLike); // поставить лайк
cardRoutes.delete('/cards/:cardId/likes ', express.json(), deleteLike); // удалить лайк

module.exports = {
  cardRoutes,
};
