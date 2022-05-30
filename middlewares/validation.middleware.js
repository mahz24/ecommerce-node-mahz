const { body, validationResult } = require('express-validator');
const { AppError } = require('../utils/AppError');

const verifyRequest = [
  body('username').notEmpty().withMessage('Username cannot be empty'),
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('This is not a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isLength({ min: 8 })
    .withMessage('Password must have at least 8 characters'),
];

const verifyProduct = [
  body('title').notEmpty().withMessage('Title cannot be empty'),
  body('description').notEmpty().withMessage('Description cannot be empty'),
  body('price').notEmpty().withMessage('Price cannot be empty'),
  body('quantity').notEmpty().withMessage('Quantity cannot be empty'),
];

const checkValidations = (req, res, next) => {
  const errs = validationResult(req);

  if (!errs.isEmpty()) {
    const msgs = errs.array().map(({ msg }) => msg);

    const errMsgs = msgs.join('. ');

    return next(new AppError(errMsgs, 400));
  }
  next();
};

module.exports = { verifyRequest, verifyProduct, checkValidations };
