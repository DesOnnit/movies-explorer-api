const router = require('express').Router();
const userRouter = require('./user');
const movieRouter = require('./movie');
const entryRoute = require('./entry');
const auth = require('../middlewares/auth');

router.use('/users', auth, userRouter);
router.use('/movies', auth, movieRouter);
router.use('/', entryRoute);

module.exports = router;
