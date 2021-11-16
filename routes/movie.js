const movieRouter = require('express').Router();
const { getMovie, createMovie, deleteMovie } = require('../controllers/movie');
const { idMovieValidation, movieValidation } = require('../middlewares/validation');

movieRouter.get('/', getMovie);
movieRouter.post('/', movieValidation, createMovie);
movieRouter.delete('/:id', idMovieValidation, deleteMovie);

module.exports = movieRouter;
