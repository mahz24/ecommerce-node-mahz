//Models
const { Cart } = require('../models/cart.model');
const { ProductInCart } = require('../models/productsInCart.model');
const { Product } = require('../models/product.model');

//Utils
const { AppError } = require('../utils/AppError');
const { catchAsync } = require('../utils/catchAsync');

const addProductToCart = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { quantity, productId } = req.body;

  let cart = await Cart.findOne({
    where: { userId: user.id, status: 'active' },
  });

  if (!cart) {
    cart = await Cart.create({ userId: user.id });
  }

  if (await ProductInCart.findOne({ where: { productId, status: 'active' } })) {
    return next(new AppError('This product exist in cart'));
  }

  const product = await ProductInCart.findOne({
    where: { productId, status: 'removed' },
  });

  if (product) {
    await product.update({ status: 'active', quantity });
  }

  const newProduct = await ProductInCart.create({
    cartId: cart.id,
    productId,
    quantity,
  });

  const product2 = await Product.findOne({ id: productId });

  if (newProduct.quantity > product2.quantity) {
    await newProduct.update({ status: 'removed' });
    return next(new AppError('The requested amount is not available'), 404);
  }
  res.status(200).json({ status: 'success', newProduct });
});

const updateProductInCart = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { productId, quantity } = req.body;

  const cart = await Cart.findOne({ userId: user.id });

  const productCart = await ProductInCart.findOne({
    where: { cartId: cart.id, productId },
  });

  if (!productCart) {
    return next(new AppError('This procuct not exist in this cart'));
  }

  await productCart.update({ quantity });

  const product = await Product.findOne({ id: productId, status: 'active' });

  if (!product) {
    return next(new AppError('Sold out', 404));
  }

  if (product.quantity < productCart.quantity) {
    await newProduct.update({ status: 'removed' });
    return next(new AppError('The requested amount is not available'), 404);
  }

  if (productCart.quantity === 0) {
    await productCart.update({ status: 'removed' });
  }

  if (productCart.quantity > 0 && productCart.status === 'removed') {
    await productCart.update({ status: 'active' });
  }

  res.status(200).json({ status: 'success', newProduct });
});

module.exports = { addProductToCart, updateProductInCart };
