const express = require('express');

const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

const { userRoutes } = require('./routes/users');

const { cardRoutes } = require('./routes/cards');

const { notFound } = require('./errors/errors');

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '631aff9a4cc9e9fceef23b39',
  };
  next();
});

app.use('/users', userRoutes);

app.use('/cards', cardRoutes);

app.use('*', (req, res) => {
  res.status(notFound).send({ message: 'Страница не найдена' });
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
