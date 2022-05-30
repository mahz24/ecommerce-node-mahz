//Models
const { Category } = require('../models/category.model');
const { Product } = require('../models/product.model');

//Utils
const { AppError } = require('../utils/AppError');
const { catchAsync } = require('../utils/catchAsync');

const checkProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findOne({
    where: { id },
    include: [{ model: Category, required: false }],
  });

  if (!product) {
    return next(new AppError('This product not exist'));
  }

  req.product = product;
  next();
});

const protectUser = catchAsync(async (req, res, next) => {
  const { user, product } = req;

  if (user.id !== product.userId) {
    return next(new AppError('this action is restricted', 403));
  }
  next();
});

module.exports = { checkProduct, protectUser };
