const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Auth = require('../errors/Auth');
const Conflict = require('../errors/Conflict');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name }))
    .then((user) => {
      res.status(201).send({
        data: { email: user.email, name: user.name },
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        throw new Conflict('Пользователь с таким email уже существует');
      }
      throw err;
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { email, name } = req.body;
  User.findByIdAndUpdate(userId, { email, name }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFound('Такого пользователя не существует');
      }
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Переданы некорректные данные');
      }
      if (err.code === 11000) {
        throw new Conflict('Пользователь с таким email уже существует');
      }
      throw err;
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      });
      res.send({ token });
    })
    .catch(() => {
      throw new Auth('Неправильный email или пароль');
    })
    .catch(next);
};

const logout = (req, res, next) => {
  res.clearCookie('jwt');
  res.redirect('/');
  next();
};

module.exports = {
  createUser, getUser, updateUser, login, logout,
};
