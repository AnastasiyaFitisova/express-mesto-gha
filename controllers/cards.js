const Card = require('../models/card');

const {
  badRequest, forbidden, notFound, internalServerError,
} = require('../errors/errors');

const createCard = async (req, res) => {
  try {
    const owner = req.user._id;
    const { name, link } = req.body;
    const card = await new Card({ owner, name, link }).save();
    return res.status(200).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(badRequest).send({ message: 'Ошибка в запросе' });
    }
    return res.status(internalServerError).send({ message: 'Произошла ошибка на сервере' });
  }
};

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(200).send(cards);
  } catch (err) {
    return res.status(internalServerError).send({ message: 'Произошла ошибка на сервере' });
  }
};

const deleteCard = async (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  try {
    const card = await Card.findByIdAndDelete(cardId);
    if (!card) {
      return res.status(notFound).send({ message: 'Карточка не существует' });
    }
    if (userId !== card.owner.toString()) {
      return res.status(forbidden).send({ message: 'Нет прав на удаление карточки' });
    }
    return res.status(200).send(card);
  } catch (err) {
    if ((err.name === 'ValidationError') || (err.kind === 'ObjectID')) {
      return res.status(badRequest).send({ message: 'Ошибка в запросе' });
    }
    return res.status(internalServerError).send({ message: 'Произошла ошибка на сервере' });
  }
};

const putLike = async (res, req) => {
  try {
    const { cardId } = req.params;
    const like = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true, runValidators: true },
    );
    if (!like) {
      return res.status(notFound).send({ message: 'Карточка не существует' });
    }
    return res.status(200).send(like);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(badRequest).send({ message: 'Ошибка в запросе' });
    }
    return res.status(internalServerError).send({ message: 'Произошла ошибка на сервере' });
  }
};

const deleteLike = async (res, req) => {
  try {
    const { cardId } = req.params;
    const delLike = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true, runValidators: true },
    );
    if (!delLike) {
      return res.status(notFound).send({ message: 'Карточка не существует' });
    }
    return res.status(200).send(delLike);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(badRequest).send({ message: 'Ошибка в запросе' });
    }
    return res.status(internalServerError).send({ message: 'Произошла ошибка на сервере' });
  }
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  putLike,
  deleteLike,
};
