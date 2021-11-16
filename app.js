/* require('dotenv').config(); */
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const { createUser, login, logout } = require('./controllers/user');
const router = require('./routes/index');
const auth = require('./middlewares/auth');
const NotFound = require('./errors/NotFound');
const error = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { loginValidation, userValidation } = require('./middlewares/validation');

const app = express();
app.use(bodyParser.json());
const { PORT = 3000 } = process.env;
app.use(helmet());
app.use(cookieParser());

app.use(cors({
  origin: [
    'https://onnit.student.nomoredomains.rocks',
    'http://onnit.student.nomoredomains.rocks',
    'http://localhost:3001',
    'https://localhost:3001',
    'http://localhost:3000',
    'https://localhost:3000',
    'http://51.250.9.2',
    'https://51.250.9.2',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

mongoose.connect('mongodb://localhost:27017/moviesdb');
app.use(requestLogger);
app.post('/signup', userValidation, createUser);
app.post('/signin', loginValidation, login);
app.post('/signout', logout);
app.use(auth, router);
app.use('*', () => {
  throw new NotFound('Запрашиваемый ресурс не найден');
});
app.use(errorLogger);
app.use(errors());
app.use(error);
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
