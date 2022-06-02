//Libreries
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

//Dotenv configuration
dotenv.config({ path: './config' });

//Models
const { User } = require('../models/user.model');
const { Product } = require('../models/product.model');
const { Order } = require('../models/order.model');
const { Cart } = require('../models/cart.model');
const { Category } = require('../models/category.model');
const { ProductInCart } = require('../models/productsInCart.model');

//Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/AppError');

const createUser = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hashPass = await bcrypt.hash(password, salt);

  const newUser = await User.create({ username, email, password: hashPass });

  newUser.password = undefined;

  res.status(200).json({ newUser });
});

const logUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email, status: 'active' } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Invalid credentials', 404));
  }

  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  user.password = undefined;

  res.status(200).json({ token, user });
});

const productsUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  const products = await Product.findAll({
    where: { userId: user.id },
    include: [{ model: Category }],
  });

  res.status(200).json({ status: 'success', products });
});

const getOrdersUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  const orders = await Order.findAll({
    where: { userId: user.id },
    include: [
      {
        model: Cart,
        required: false,
        include: [{ model: ProductInCart, where: { status: 'purchsed' } }],
      },
    ],
  });

  res.status(200).json({ orders });
});

const getOrderById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findOne({
    where: { id },
    include: [
      {
        model: Cart,
        required: false,
        include: [
          {
            model: ProductInCart,
            required: false,
            where: { status: 'purchsed' },
          },
        ],
      },
    ],
  });

  if (!order) {
    next(new AppError('This order not exist'));
  }

  res.status(200).json({ order });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { username, email } = req.body;
  const { user } = req;

  const userUpdate = await User.findOne({ where: { id: user.id } });

  await userUpdate.update({ username, email });

  res.status(200).json({ status: 'success' });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  const userDisable = await User.findOne({ where: { id: user.id } });

  await userDisable.update({ status: 'disabled' });

  res.status(200).json({ status: 'success' });
});

module.exports = {
  createUser,
  logUser,
  productsUser,
  getOrdersUser,
  getOrderById,
  updateUser,
  deleteUser,
};
