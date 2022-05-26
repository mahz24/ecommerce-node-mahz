//models
const { User } = require('./user.model');
const { Order } = require('./order.model');
const { Product } = require('./product.model');
const { ProductInCart } = require('./productsInCart.model');
const { Cart } = require('./cart.model');

const relations = () => {
  //User --> Products
  User.hasMany(Product);
  Product.belongsTo(User);

  //User --> Cart
  User.hasOne(Cart);
  Cart.belongsTo(User);

  //User --> Orders
  User.hasMany(Order);
  Order.belongsTo(User);

  //Cart --> ProductsInCart
  Cart.hasMany(ProductInCart);
  ProductInCart.belongsTo(Cart);

  //Cart --> Order
  Cart.hasOne(Order);
  Order.belongsTo(Cart);
};

module.exports = { relations };
