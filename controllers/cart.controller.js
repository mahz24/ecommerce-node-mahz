//Models
const { Cart } = require('../models/cart.model');
const { ProductInCart } = require('../models/productsInCart.model');
const { Product } = require('../models/product.model');
const { Order } = require('../models/order.model');

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

  const existProductInCart = await ProductInCart.findOne({
    where: { productId, status: 'active' },
  });

  if (existProductInCart) {
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

  const product2 = await Product.findOne({ where: { id: productId } });

  if (newProduct.quantity > product2.quantity) {
    await newProduct.update({ status: 'removed' });
    return next(new AppError('The requested amount is not available'), 404);
  }
  res.status(200).json({ status: 'success', newProduct });
});

const updateProductInCart = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { productId, quantity } = req.body;

  const cart = await Cart.findOne({ where: { userId: user.id } });

  const productCart = await ProductInCart.findOne({
    where: { cartId: cart.id, productId },
  });

  if (!productCart) {
    return next(new AppError('This procuct not exist in this cart'));
  }

  await productCart.update({ quantity });

  const product = await Product.findOne({
    where: { id: productId, status: 'active' },
  });

  if (!product) {
    return next(new AppError('Sold out', 404));
  }

  if (product.quantity < productCart.quantity) {
    await productCart.update({ status: 'removed' });
    return next(new AppError('The requested amount is not available'), 404);
  }

  if (productCart.quantity === 0) {
    await productCart.update({ status: 'removed' });
  }

  if (productCart.quantity > 0 && productCart.status === 'removed') {
    await productCart.update({ status: 'active' });
  }

  res.status(200).json({ status: 'success' });
});

const deleteProductCart = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const product = await ProductInCart.findOne({ where: { productId } });

  if (!product) {
    return next(new AppError('This product not exist', 404));
  }

  await product.update({ quantity: 0, status: 'removed' });

  res.status(200).json({ status: 'success', product });
});

const productPurchase = catchAsync(async (req, res, next) => {
  const { user } = req;
  const cart = await Cart.findOne({
    where: { userId: user.id, status: 'active' },
    include: [{ model: ProductInCart, where: { status: 'active' } }],
  });

  if (!cart) {
    return next(new AppError('Cart not exist', 404));
  }

  let total = 0;

  const cartPurchased = cart.productincarts.map(async prod => {
    const product = await Product.findOne({ where: { id: prod.productId } });

    const quantity = product.quantity - prod.quantity;

    await product.update({ quantity });

    total += product.price * prod.quantity;

    await prod.update({ status: 'purchased' });

    return product;
  });

  await Promise.all(cartPurchased);

  await cart.update({ status: 'purchased' });

  const orderNew = await Order.create({
    userId: user.id,
    cartId: cart.id,
    totlaPrice: total,
  });

  const order = await Order.findOne({
    where: { cartId: orderNew.cartId },
    include: [{ model: Cart, include: [{ model: ProductInCart }] }],
  });

  res.status(200).json({ order, total });
});

module.exports = {
  addProductToCart,
  updateProductInCart,
  deleteProductCart,
  productPurchase,
};
