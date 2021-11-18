const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const customValidate = (url) => {
  const result = validator.isURL(url);
  if (!result) {
    throw new Error('URL заполнен неправильно');
  }
  return url;
};
const idMovieValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const userValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const movieValidation = celebrate({
  body: Joi.object().keys({
    movieId: Joi.number().integer().required(),
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(customValidate),
    trailer: Joi.string().required().custom(customValidate),
    thumbnail: Joi.string().required().custom(customValidate),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const userUpdateValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

module.exports = {
  userValidation,
  idMovieValidation,
  movieValidation,
  loginValidation,
  userUpdateValidation,
};
