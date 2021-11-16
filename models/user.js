const bcrypt = require('bcrypt');
const { Schema, model } = require('mongoose');
const { isEmail } = require('validator');
const Auth = require('../errors/Auth');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return isEmail(email);
      },
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new Auth('Неправильный email или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new Auth('Неправильный email или пароль');
          }
          return user;
        });
    });
};

module.exports = model('user', userSchema);
