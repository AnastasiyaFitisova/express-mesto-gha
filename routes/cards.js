const express = require('express');

const {
  getCards, createCard, deleteCard, putLike, deleteLike,
} = require('../controllers/cards');

const cardRoutes = express.Router();

cardRoutes.get('/', getCards); // возвращает все карточки
cardRoutes.post('/', createCard); // создает карточку
cardRoutes.delete('/:cardId', deleteCard); // удаляет карточку
cardRoutes.put('/:cardId/likes', putLike); // поставить лайк
cardRoutes.delete('/:cardId/likes', deleteLike); // удалить лайк

module.exports = {
  cardRoutes,
};
