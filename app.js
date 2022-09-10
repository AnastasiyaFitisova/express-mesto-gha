const express = require('express');

const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

const { userRoutes } = require('./routes/users');

const { cardRoutes } = require('./routes/cards');

app.use((req, res, next) => {
  req.user = {
    _id: '631aff9a4cc9e9fceef23b39',
  };
  next();
});

app.use(userRoutes);

app.use(cardRoutes);

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  await app.listen(PORT);
}

main();
