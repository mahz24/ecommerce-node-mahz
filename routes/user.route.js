const express = require('express');

//Controllers
const {
  createUser,
  logUser,
  productsUser,
  getOrdersUser,
  getOrderById,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller');

//Middlewares
const { checkToken, userRequest } = require('../middlewares/user.middleware');
const {
  checkValidations,
  verifyRequest,
} = require('../middlewares/validation.middleware');

//Init routes
const router = express.Router();

router.post('/', verifyRequest, checkValidations, createUser);
router.post('/login', logUser);

router.use(checkToken);

//Protected routes
router.get('/me', productsUser);
router.get('/orders', getOrdersUser);
router.get('/orders/:id', getOrderById);

router
  .route('/:id')
  .patch(userRequest, updateUser)
  .delete(userRequest, deleteUser);

module.exports = { userRouter: router };
