const express = require('express');

//Middlewares
const { checkToken } = require('../middlewares/user.middleware');

//Controller
const {
  addProductToCart,
  updateProductInCart,
  deleteProductCart,
  productPurchase,
} = require('../controllers/cart.controller');

const router = express.Router();

router.use(checkToken);

router.post('/add-product', addProductToCart);
router.patch('/update-cart', updateProductInCart);
router.delete('/:productId', deleteProductCart);
router.post('/purchase', productPurchase);

module.exports = { cartRouter: router };
