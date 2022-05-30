const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Dotenv configuration
dotenv.config({ path: './config.env' });

//Utils
const { AppError } = require('../utils/AppError');
const { catchAsync } = require('../utils/catchAsync');

//Models
const { User } = require('../models/user.model');

const checkToken = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Sesion invalid', 403));
  }

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findOne({
    where: { id: decoded.id, status: 'active' },
  });

  if (!user) {
    return next(
      new AppError('The owner of ths token is no longer available', 403)
    );
  }
  req.user = user;
  next();
});

//This funtion verify that user exist and user can delete or update
const userRequest = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { user } = req;

  const userVerify = await User.findOne({ where: { id, status: 'active' } });
  console.log(userVerify);

  if (!userVerify || userVerify.id !== user.id) {
    return next(new AppError('check user id please', 403));
  }

  next();
});

module.exports = { checkToken, userRequest };
