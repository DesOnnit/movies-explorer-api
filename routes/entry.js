const entryRoute = require('express').Router();
const { loginValidation, userValidation } = require('../middlewares/validation');
const { createUser, login, logout } = require('../controllers/user');

entryRoute.post('/signup', userValidation, createUser);
entryRoute.post('/signin', loginValidation, login);
entryRoute.post('/signout', logout);

module.exports = entryRoute;
