//Models
const { Category } = require('../models/category.model');
const { Product } = require('../models/product.model');

//Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/AppError');

const createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  const category = await Category.create({ name });

  res.status(200).json({ status: 'success', category });
});

const getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.findAll({ where: { status: 'active' } });

  res.status(200).json({ categories });
});

const updateCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  const category = await Category.findOne({ where: { id } });

  if (!category) {
    return next(new AppError('This category no exist', 404));
  }

  await category.update({ name });

  res.status(200).json({ status: 'success' });
});

const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findAll({
    where: { status: 'active' },
    include: [{ model: Category, required: false }],
  });

  res.status(200).json({ products });
});

const addProduct = catchAsync(async (req, res, next) => {
  const { title, description, quantity, price, categoryId } = req.body;
  const { user } = req;

  const product = await Product.create({
    title,
    description,
    quantity,
    price,
    categoryId,
    userId: user.id,
  });

  res.status(200).json({ status: 'success', product });
});

const getProductById = catchAsync(async (req, res, next) => {
  const { product } = req;
  res.status(200).json({ product });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const { product } = req;
  const { title, description, price, quantity } = req.body;

  await product.update({ title, description, price, quantity });
  res.status(200).json({ status: 'success' });
});

const deleteProduct = catchAsync(async (req, res, next) => {
  const { product } = req;

  await product.update({ status: 'deleted' });

  res.status(200).json({ status: 'success' });
});

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  getAllProducts,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
