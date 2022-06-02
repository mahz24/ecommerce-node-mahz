const express = require('express');
const { upload } = require('../utils/multer');

//Middleware
const { checkToken } = require('../middlewares/user.middleware');
const {
  checkProduct,
  protectUser,
} = require('../middlewares/product.middleware');
const {
  verifyProduct,
  checkValidations,
} = require('../middlewares/validation.middleware');

//Constrollers
const {
  createCategory,
  getAllCategories,
  updateCategory,
  getAllProducts,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');

const router = express.Router();

router.use(checkToken);

//Categories routers
router.route('/categories').post(createCategory).get(getAllCategories);
router.patch('/categories/:id', updateCategory);

//Products routers
router
  .route('/')
  .get(getAllProducts)
  .post(
    upload.array('productImgs'),
    verifyProduct,
    checkValidations,
    addProduct
  );
router
  .route('/:id')
  .get(checkProduct, getProductById)
  .patch(checkProduct, protectUser, updateProduct)
  .delete(checkProduct, protectUser, deleteProduct);

module.exports = { productRouter: router };
