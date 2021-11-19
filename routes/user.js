const userRouter = require('express').Router();
const { getUser, updateUser } = require('../controllers/user');
const { userUpdateValidation } = require('../middlewares/validation');

userRouter.get('/me', getUser);
userRouter.patch('/me', userUpdateValidation, updateUser);

module.exports = userRouter;
