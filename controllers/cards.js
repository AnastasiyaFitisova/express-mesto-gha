const Card = require('../models/card');

const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');
const NotFound = require('../errors/NotFound');
const InternalServerError = require('../errors/InternalServerError');

const createCard = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const { name, link } = req.body;
    const card = await new Card({ owner, name, link }).save();
    return res.status(200).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequest('Ошибка в запросе'));
    }
    return next(new InternalServerError('Произошла ошибка на сервере'));
  }
};

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.status(200).send(cards);
  } catch (err) {
    return next(new InternalServerError('Произошла ошибка на сервере'));
  }
};

const deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  try {
    const card = await Card.findById(cardId);
    if (!card) {
      return next(new NotFound('Карточка не существует'));
    } if (userId !== card.owner.toString()) {
      return next(Forbidden('Нет прав на удаление карточки'));
    }
    await Card.findByIdAndDelete(cardId);
    return res.status(200).send(card);
  } catch (err) {
    if ((err.name === 'ValidationError') || (err.kind === 'ObjectID')) {
      return next(new BadRequest('Ошибка в запросе'));
    }
    return next(new InternalServerError('Произошла ошибка на сервере'));
  }
};

const putLike = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const like = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true, runValidators: true },
    );
    if (!like) {
      return next(new NotFound('Карточка не существует'));
    }
    return res.status(200).send(like);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequest('Ошибка в запросе'));
    }
    return next(new InternalServerError('Произошла ошибка на сервере'));
  }
};

const deleteLike = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const delLike = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true, runValidators: true },
    );
    if (!delLike) {
      return next(new NotFound('Карточка не существует'));
    }
    return res.status(200).send(delLike);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequest('Ошибка в запросе'));
    }
    return next(new InternalServerError('Произошла ошибка на сервере'));
  }
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  putLike,
  deleteLike,
};
