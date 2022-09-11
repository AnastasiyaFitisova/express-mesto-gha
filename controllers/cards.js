const Card = require('../models/card');

const createCard = async (req, res) => {
  try {
    const owner = req.user._id;
    const { name, link } = req.body;
    const card = await new Card({ owner, name, link }).save();
    return res.status(200).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Ошибка в запросе' });
    }
    return res.status(500).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(200).send(cards);
  } catch (err) {
    return res.status(500).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

const deleteCard = async (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  try {
    const card = await Card.findByIdAndDelete(cardId);
    if (!card) {
      return res.status(404).send({ message: 'Карточка не существует' });
    }
    if (userId !== card.owner.toString()) {
      return res.status(403).send({ message: 'Нет прав на удаление карточки' });
    }
    return res.status(200).send(card);
  } catch (err) {
    if ((err.name === 'ValidationError') || (err.kind === 'ObjectID')) {
      return res.status(400).send({ message: 'Переданные данные некорректны' });
    }
    return res.status(500).send({ message: 'Произошла ошибка на сервере', ...err });
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
      return res.status(404).send({ message: 'Карточка не существует' });
    }
    return res.status(200).send(like);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Ошибка в запросе' });
    }
    return res.status(500).send({ message: 'Произошла ошибка на сервере', ...err });
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
      return res.status(404).send({ message: 'Карточка не существует' });
    }
    return res.status(200).send(delLike);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Ошибка в запросе' });
    }
    return res.status(500).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  putLike,
  deleteLike,
};
