const express = require('express');

//Middlewares
const { checkToken } = require('../middlewares/user.middleware');

//Controller
const {
  addProductToCart,
  updateProductInCart,
} = require('../controllers/cart.controller');

const router = express.Router();

router.use(checkToken);

router.post('/add-product', addProductToCart);
router.patch('/update-cart', updateProductInCart);

module.exports = { cartRouter: router };
