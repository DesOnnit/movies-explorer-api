/* eslint-disable max-len */
const Movie = require('../models/movie');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');

const getMovie = (req, res, next) => {
  Movie.find({})
    .then((movie) => {
      res.status(200).send({ data: movie });
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  const owner = req.user_id;
  Movie.create({
    country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId, owner,
  })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные');
      } else { next(err); }
    });
};

const deleteMovie = (req, res, next) => {
  const { id } = req.params;
  const owner = req.user_id;
  Movie.findById(id)
    .then((movie) => {
      if (!movie) {
        throw new NotFound('Такого фильма не сущетсвует');
      }
      if (movie.owner.toString() === owner) {
        Movie.findByIdAndRemove(id)
          .then((movieData) => {
            res.send(movieData);
          });
      } else {
        throw new Forbidden('Недостаточно прав');
      }
    })
    .catch(next);
};

module.exports = { getMovie, createMovie, deleteMovie };
