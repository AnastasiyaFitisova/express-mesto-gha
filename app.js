const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');

const { userRoutes } = require('./routes/users');
const { cardRoutes } = require('./routes/cards');

const { createUser, login } = require('./controllers/users');

const { auth } = require('./middlewares/auth');

const BadRequest = require('./errors/BadRequest');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().default('Жак-Ив Кусто').min(2)
      .max(30),
    about: Joi.string().required().default('Исследователь').min(2)
      .max(30),
    avatar: Joi.string().required().default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png').regex(/^(https?:\/\/)?([\w.]+)\.([a-z]{2,6}\.?)(\/[\w.]*)*\/?$/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use(auth);

app.use('/users', userRoutes);

app.use('/cards', cardRoutes);

app.use(errors());

app.use('*', (req, res, next) => {
  next(new BadRequest('Страница не найдена'));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next(err);
});

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  await app.listen(PORT);
}

main();
